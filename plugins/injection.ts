import services from '~~/src/Injections/Services'

/**
 * Подключение севрисов в проект
 */
export default defineNuxtPlugin(() => {
    return {
        provide: {
            services,
        },
    }
})
