import { defineStore } from 'pinia'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    lang: 'ru',
    drawers: {},
  }),
  actions: {
    setLang(lang: string) {
      this.lang = lang
    },
  },
})
