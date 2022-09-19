# Карта использованных технологий по коду

## Инструменты разработки

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
