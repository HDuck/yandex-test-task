# yandex-test-task

## Описание

Необходимо сделать клиентское приложение (сайт), где будет табло аэропорта.
У табло должны быть следующие функции:
* просмотр только вылетающий рейсов
* просмотр только прилетающих рейсов
* просмотр задержанных рейсов
* поиск по номеру рейса
В качестве примера можно посмотреть на http://www.svo.aero/.
Ограничений на использование шаблонизаторов и библиотек нет.

Плюсом будет, если данные для табло вы получите из публичных api. Если решите их не использовать,
то положите данные в отдельный файл в репозитории.

## Публичное API

Данные предоставлены на бесплатной основе сервисом FlightStats. 
Кол-во запросов к их данным при бесплатном пакете ограничено: 100/eternity.
Поэтому в любой момент может быть ограничен доступ к их API.

Данные взяты для аэропорта Шереметьево.

В случае, если все-таки API перестанет работать, то скрипт будет брать данные из JSON-переменной.
Которая была составлена в урезанном варианте от предоставляемых API данных (только самое необходимое на мой взгляд для работы приложения).

## Ссылка на GitHub Pages

https://hduck.github.io/yandex-test-task/

## Использованные технологии

Pug, Scss, Bootstrap 4, JavaScript, Jquery, Gulp.
