# Карта использованных технологий по коду

## Фичи кода

### Канвас

Для вывода игр используется канвас. 
Основной класс для построения канваса игры CanvasRenderer
https://github.com/kosukhin/brick-game-simulator/blob/master/src/Common/Library/CanvasRenderer.ts

Канвас устроен очень просто, он рендерит все квадратики массива в MGrid
но закрашивает черным только те, у которых 1 в значении

### Хуки приложения

В приложении хуки используются на основе собственного класса Observable
https://github.com/kosukhin/brick-game-simulator/blob/master/src/Common/Library/Observable.ts

Можно было использовать например EventBus на основе VueApp, но 
кажется этот подход уже используется редко.

В сервисе SHooks хранятся основные хуки приложения
https://github.com/kosukhin/brick-game-simulator/blob/master/src/Common/Services/SHooks.ts

### Element UI Plus

В качестве библиотеки UI элементов выбрал ElementUI. Который поключается через плагины
https://github.com/kosukhin/brick-game-simulator/blob/master/plugins/element-plus.ts

Выбрал самый простой способ подключения как плагин, потому что приложение тестовое.
Если бы приложение было для продакшена и важен был бы размер бандлов, то нужно было бы
думать о более сложной стратегии разделения кода компонентов ElementUI


## Инструменты разработки

### JEST

Для запуска модульных тестов используется Jest
https://github.com/kosukhin/brick-game-simulator/blob/master/jest.config.js

Для отслеживания покрытия тестами есть команда
`npm run testcovarage`
Которая сформирует отчет по покрытию тестами.

### Stylelint

Для слежения за качеством Стилей используется stylelint
https://github.com/kosukhin/brick-game-simulator/blob/master/.stylelintrc.json

### EsLint

Для отслеживания качества кода используется EsLint конфиг здесь
https://github.com/kosukhin/brick-game-simulator/blob/master/.eslintrc

### Husky

Для запуска тестов, eslint, stylelint перед комитом
используется Husky.
В .husky/pre-commit запускается npx lint-staged
https://github.com/kosukhin/brick-game-simulator/blob/master/.husky/pre-commit

lint-staged сконфигурирован в package.json
```json
  "lint-staged": {
    "*.{ts,js,vue}": "npm run lintfix",
    "*.{ts,js}": "jest ./tests/",
    "*.{vue,scss}": "stylelint '**/*.{vue,scss}'"
  },
```
