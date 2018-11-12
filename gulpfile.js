const gulp = require('gulp'),
      pug = require('gulp-pug'),
      scss = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cssMinify = require('gulp-csso'),
      clean = require('gulp-clean'),
      concat = require('gulp-concat'),
      rename = require('gulp-rename'),
      browSync = require('browser-sync'),
      argv = require('minimist')(process.argv.slice(2)),
      uglifyJs = require('gulp-uglify');

const devMode = argv.env !== 'production';
const srcDest = './src';
const devDest = './dist';
const prodDest = './docs';
const devBuild = ['pug', 'scss', 'concat:js', 'jsLibs'];
const prodBuild = ['pug', 'scss', 'minify-css', 'concat:js', 'jsLibs' 'minify-js'];

gulp.task('serverSync', ['build'], () => {
    browSync.init({
        server: {
            baseDir: devDest
        }
    });

    gulp.watch([`${srcDest}/**/*.scss`], ['scss']);
    gulp.watch([`${srcDest}/**/*.pug`], ['pug']);
    gulp.watch([`${srcDest}/**/*.js`, `${srcDest}/**/*/*.js`], ['concat:js']);
});

gulp.task('scss', ['cleanCss'], () => {
    return gulp.src(`${srcDest}/index.scss`)
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(gulp.dest(`${devMode ? devDest : srcDest}/css`)))
        .pipe(browSync.stream());
});

gulp.task('pug', ['cleanHtml'], () => {
    gulp.src(`${srcDest}/main.pug`)
        .pipe(pug({ 
            pretty: devMode ? true : false,
            locals: { devMode: devMode }
        }))
        .pipe(gulp.dest(devMode ? devDest : prodDest))
        .pipe(browSync.stream());
});

gulp.task('jsLibs', () => {
    gulp.src([
        `~jquery/dist/jquery.min.js`,
        `~popper.js/dist/popper.min.js`
    ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(`${devMode ? devDest : srcDest}/js`))
});

gulp.task('concat:js', ['cleanJs'], () => {
    gulp.src([
            `${srcDest}/**/*.js`,
            `${srcDest}/**/*/*.js`
        ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(`${devMode ? devDest : srcDest}/js`))
        .pipe(browSync.stream());
});

gulp.task('watch', () => {
    gulp.watch([
            `${srcDest}/**/*.pug`,
            `${srcDest}/**/*.scss`],
        ['pug', 'scss']);
});

gulp.task('cleanHtml', () => {
    return gulp.src(`${devMode ? devDest : prodDest}/*.html`)
        .pipe(clean());
});

gulp.task('cleanCss', () => {
    return gulp.src(`${devMode ? devDest : prodDest}/css`)
        .pipe(clean());
});

gulp.task('cleanJs', () => {
    return gulp.src(`${devMode ? devDest : prodDest}/js/scripts${devMode ? '.js' : '.min.js'}`)
        .pipe(clean());
});

gulp.task('minify-css', () => {
    gulp.src(`${prodDest}/css/styles.css`)
        .pipe(cssMinify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${prodDest}/css`))
});

gulp.task('minify-js', () => {
    gulp.src(`${prodDest}/js/scripts.js`)
        .pipe(uglifyJs())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${prodDest}/js`))
});

gulp.task('build', devMode ? devBuild : prodBuild);