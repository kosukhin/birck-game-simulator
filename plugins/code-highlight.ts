import VueHighlightJS from 'vue3-highlightjs'

/**
 * Подкллючение HightlightJS в проект
 */
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueHighlightJS)
})
