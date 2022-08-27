import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    mode: 'spa',
    css: ['~~/src/Assets/styles/global.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData:
                        '@import "~~/src/Assets/styles/colors.scss";',
                },
            },
        },
    },
})
