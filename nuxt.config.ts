import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  css: ['~~/src/common/assets/styles/global.scss'],
  modules: ['@nuxt/image-edge'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "~~/src/common/assets/styles/colors.scss";@import "~~/src/common/assets/styles/mixins.scss";',
        },
      },
    },
  },
})
