<template>
    <a
        :class="['flag-link', { selected: appStore.lang === 'en' }]"
        href="#"
        @click.prevent="changeLang('en')"
    >
        <img
            class="flag"
            src="/static/flags/en.svg"
            :alt="$services.lang.t('Switch to') + ' en'"
        />
        {{ $services.lang.t('English') }}
    </a>
    <a
        :class="['flag-link', { selected: appStore.lang === 'ru' }]"
        href="#"
        @click.prevent="changeLang('ru')"
    >
        <img
            class="flag"
            src="/static/flags/ru.svg"
            :alt="$services.lang.t('Switch to') + ' ru'"
        />
        {{ $services.lang.t('Russian') }}
    </a>
</template>

<script setup lang="ts">
import { useApplicationStore } from '~~/stores/application'

const appStore = useApplicationStore()
const changeLang = (lang) => {
    appStore.setLang(lang)
}
</script>
