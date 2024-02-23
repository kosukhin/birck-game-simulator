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
const { locale } = useI18n()
const changeLang = (lang: string) => {
  locale.value = lang
}
</script>
