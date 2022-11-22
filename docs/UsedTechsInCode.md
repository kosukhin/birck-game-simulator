# Карта использованных технологий по коду

## Фичи кода

### Канвас

Для вывода игр используется канвас. 
Основной класс для построения канваса игры CanvasRenderer
https://github.com/kosukhin/brick-game-simulator/blob/master/src/Common/Library/CanvasRenderer.ts

Канвас устроен очень просто, он рендерит все квадратики массива в MGrid
но закрашивает черным только те, у которых 1 в значении

### Three.js 3D

Для отрисовки блоков тетриса в виде 3д кубов была использована
библиотека three.js, на основе которой был написан специальный рендерер
https://github.com/kosukhin/brick-game-simulator/blob/master/src/Common/Library/ThreeJsRenderer.ts

### Работа с формами

В проекте использован element-ui+, у которого есть свои формы и есть встроенная
система валидации форм. Пример кода формы и ее валидации можно посмотреть здесь:
https://github.com/kosukhin/brick-game-simulator/blob/master/pages/offer.vue#L43

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

### Pinia

В качестве глобального хранилища данных используется Pinia, подключается в проект как плагин
здесь: https://github.com/kosukhin/brick-game-simulator/blob/master/plugins/pinia.ts

Пока только один стор сделал для хранения текущего языка приложения
https://github.com/kosukhin/brick-game-simulator/blob/master/stores/application.ts

В будущем возможно расширю

### WebWorker

В качестве примера запуска параллельного потока выполнения JS использовал Worker
https://github.com/kosukhin/brick-game-simulator/blob/master/src/Common/Library/WebWorker.ts

За основу взял этот репозиторий: https://github.com/israelss/simple-web-worker/
Но столкнулся с проблемой, что в реализации simple-web-worker нельзя запускать асинхронный код.
А я хотел именно сделать асинхронную работу внутри воркера, поэтому сделал свой библиотечный класс

### WebSockets

Для работы серверной стороны использую socket.io сделал сервер по стандартной доке:
https://github.com/kosukhin/brick-game-simulator/blob/master/sockets/index.js

Для клиентской стороны отправляю события из компонента Simulator после нажатия кнопки "Начать трансляцию"
https://github.com/kosukhin/brick-game-simulator/blob/master/src/Common/Components/Simulator/Simulator.vue#L56

Дальше в компоненте pages/translation.vue я подписываюсь на сокет и отображаю сетку на канвасе
https://github.com/kosukhin/brick-game-simulator/blob/master/pages/translation.vue#L31
При изменении ширины\высоты сетки с помощью key заставляю канвас перерендериться

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

### VsCode launch.json

Настроил конфиг для запуска тестов, чтобы было удобнее тестировать один файл
https://github.com/kosukhin/brick-game-simulator/blob/master/.vscode/launch.json
