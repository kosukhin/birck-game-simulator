import VueHighlightJS from 'vue3-highlightjs'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueHighlightJS)
})
