export default defineNuxtPlugin(({ $router }) => {
    $router.beforeEach(() => {
        const nuxtElement = document.getElementById('__nuxt')

        if (nuxtElement) {
            nuxtElement.scrollTo({ top: 0, behavior: 'smooth' })
        }
    })
})
