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
      uglifyJs = require('gulp-uglify-es').default;

const devMode = argv.env !== 'production';
const srcDest = './src';
const devDest = './dist';
const prodDest = './docs';
const devBuild = ['pug', 'scss', 'concat:js', 'libs'];
const prodBuild = ['pug', 'minify-css', 'minify-js', 'libs' ];

gulp.task('serverSync', ['build'], () => {
    browSync.init({
        server: {
            baseDir: devDest
        }
    });

    gulp.watch([`${srcDest}/**/*/*.scss`], ['scss']);
    gulp.watch([`${srcDest}/**/*/*.pug`], ['pug']);
    gulp.watch([`${srcDest}/*.js`, `${srcDest}/**/*/*.js`], ['concat:js']);
});

gulp.task('scss', ['cleanCss'], () => {
    return gulp.src(`${srcDest}/index.scss`)
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(rename({ basename: 'styles' }))
        .pipe(gulp.dest(`${devMode ? devDest : prodDest}/css`))
        .pipe(browSync.stream());
});

gulp.task('pug', ['cleanHtml'], () => {
    gulp.src(`${srcDest}/index.pug`)
        .pipe(pug({ 
            pretty: devMode ? true : false,
            locals: { devMode: devMode }
        }))
        .pipe(gulp.dest(devMode ? devDest : prodDest))
        .pipe(browSync.stream());
});

gulp.task('libs', () => {
    gulp.src([
        `./node_modules/jquery/dist/jquery.min.js`,
        `./node_modules/popper.js/dist/popper.min.js`,
        `./node_modules/bootstrap/dist/js/bootstrap.min.js`
    ])
        .pipe(gulp.dest(`${devMode ? devDest : prodDest}/libs`))
});

gulp.task('concat:js', ['cleanJs'], () => {
    gulp.src([
            `${srcDest}/index.js`,
            `${srcDest}/blocks/*/*.js`,
            `${srcDest}/js/*.js`
        ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(`${devMode ? devDest : prodDest}/js`))
        .pipe(browSync.stream());
});

gulp.task('watch', () => {
    gulp.watch([
            `${srcDest}/blocks/**/*.pug`,
            `${srcDest}/blocks/**/*.scss`],
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

gulp.task('minify-css', ['scss'], () => {
    gulp.src(`${prodDest}/css/styles.css`)
        .pipe(cssMinify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${prodDest}/css`))
});

gulp.task('minify-js', ['concat:js'], () => {
    gulp.src(`${prodDest}/js/scripts.js`)
        .pipe(uglifyJs())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${prodDest}/js`))
});

gulp.task('build', devMode ? devBuild : prodBuild);