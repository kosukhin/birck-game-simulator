<template>
  <a
    :class="['flag-link', { selected: appStore.lang === 'en' }]"
    href="#"
    @click.prevent="changeLang('en')"
  >
    <img
      :alt="'Switch to' + ' en'"
      class="flag"
      src="/images/flags/en.svg"
    />
    {{ 'English' }}
  </a>
  <a
    :class="['flag-link', { selected: appStore.lang === 'ru' }]"
    href="#"
    @click.prevent="changeLang('ru')"
  >
    <img
      :alt="'Switch to' + ' ru'"
      class="flag"
      src="/images/flags/ru.svg"
    />
    {{ 'Russian' }}
  </a>
</template>

<script lang="ts" setup>
import { useApplicationStore } from '~~/stores/application'

const appStore = useApplicationStore()
const changeLang = (lang) => {
  appStore.setLang(lang)
}
</script>
