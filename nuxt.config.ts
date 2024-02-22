import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  css: ['~~/src/common/assets/styles/global.scss'],
  modules: ['@nuxt/image-edge', '@nuxtjs/i18n'],
  i18n: {
    vueI18n: './i18n.config.ts',
  },
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
