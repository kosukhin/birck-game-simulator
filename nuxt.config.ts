import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr: false,
    css: ['~~/src/Common/Assets/styles/global.scss'],
    modules: ['@nuxt/image-edge'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData:
                        '@import "~~/src/Common/Assets/styles/colors.scss";@import "~~/src/Common/Assets/styles/mixins.scss";',
                },
            },
        },
    },
})
