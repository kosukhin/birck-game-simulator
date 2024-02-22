export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'ru',
  globalInjection: true,
  messages: {
    en: {
      welcome: 'Welcome',
    },
    ru: {
      'About project': 'О проекте',
    },
  },
}))
