<template>
  <a
    :class="['flag-link', { selected: locale === 'en' }]"
    href="#"
    @click.prevent="changeLang('en')"
  >
    <img
      :alt="$t('Switch to') + ' en'"
      class="flag"
      src="/images/flags/en.svg"
    />
    {{ $t('English') }}
  </a>
  <a
    :class="['flag-link', { selected: locale === 'ru' }]"
    href="#"
    @click.prevent="changeLang('ru')"
  >
    <img
      :alt="$t('Switch to') + ' ru'"
      class="flag"
      src="/images/flags/ru.svg"
    />
    {{ $t('Russian') }}
  </a>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '~/src/common/composables/useLocalStorage'

const { locale } = useI18n()
const { get, set } = useLocalStorage()

get('lang', 'ru').map((v: string) => {
  locale.value = v
  return v
})

const changeLang = (lang: string) => {
  set(lang, 'lang')
  locale.value = lang
}
</script>
