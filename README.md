# Тестовое задание acme crypto corp 
## Запуск тестов 
```
$ npm test # запуск unit-тестов
$ npm run test:integration # запуск интеграционных тестов
```
## Запуск для разработки 
1. Создать файл .env с содержимым
```
PGHOST=localhost
PGDATABASE=postgres
PGUSER=postgres
```
2. Запустить postgres 
```
$ docker-compose up db
```
3. Запустить приложение 
```
$ npm start
```
## Запуск в продуктиве
```
$ docker-compose up
```