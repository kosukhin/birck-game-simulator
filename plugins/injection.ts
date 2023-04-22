import services from '~~/src/Injections/Services'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            services,
        },
    }
})
