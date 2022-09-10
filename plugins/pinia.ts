import { createPinia } from 'pinia'

/**
 * Подключение Pinia в проект
 */
export default defineNuxtPlugin((nuxtApp) => {
    const pinia = createPinia()
    nuxtApp.vueApp.use(pinia)
})
