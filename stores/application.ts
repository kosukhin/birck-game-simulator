import { defineStore } from 'pinia'

export const useApplicationStore = defineStore('application', {
  state: () => ({ lang: 'ru' }),
  actions: {
    setLang(lang: string) {
      this.lang = lang
    },
  },
})
