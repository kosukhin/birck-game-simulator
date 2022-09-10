import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/**
 * Подкллючение Element UI в проект
 */
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(ElementPlus)
})
