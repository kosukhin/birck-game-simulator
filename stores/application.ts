import { defineStore } from 'pinia'

export const useApplicationStore = defineStore('application', {
    state: () => ({ lang: 'ru' }),
    actions: {
        setLang(lang) {
            this.lang = lang
        },
    },
})
