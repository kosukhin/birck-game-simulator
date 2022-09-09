<template>
    <Header />
    <div class="content">
        <div class="middle">
            <breadcrumbs />
        </div>
        <NuxtPage />
    </div>
    <DrawerWrapper />
    <Footer />
</template>

<script lang="ts" setup>
import Footer from './src/Common/Components/Footer/Footer.vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SHooks } from '~~/src/Common/Services/SHooks'
import Breadcrumbs from '~~/src/Common/Components/Breadcrumbs/Breadcrumbs.vue'
import DrawerWrapper from '~~/src/Common/Components/DrawerWrapper/DrawerWrapper.vue'
import Header from '~~/src/Common/Components/Header/Header.vue'

useService<SHooks>('hooks').init.runSubscribers()
useHead({
    title: 'Brick Games Симулятор',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    charset: 'utf-8',
    meta: [
        { name: 'msapplication-TileColor', content: '#ffffff' },
        {
            name: 'msapplication-TileImage',
            content: '/static/ms-icon-144x144.png',
        },
        { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
        { rel: 'icon', href: '/static/favicon.ico', type: 'image/x-icon' },
        {
            rel: 'apple-touch-icon',
            sizes: '57x57',
            href: '/static/apple-icon-57x57.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '60x60',
            href: '/static/apple-icon-60x60.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '72x72',
            href: '/static/apple-icon-72x72.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '76x76',
            href: '/static/apple-icon-76x76.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '114x114',
            href: '/static/apple-icon-114x114.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '120x120',
            href: '/static/apple-icon-120x120.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '144x144',
            href: '/static/apple-icon-144x144.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '152x152',
            href: '/static/apple-icon-152x152.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/static/apple-icon-180x180.png',
        },
        {
            rel: 'icon',
            sizes: '192x192',
            href: '/static/android-icon-192x192.png',
            type: 'image/png',
        },
        {
            rel: 'icon',
            sizes: '32x32',
            href: '/static/android-icon-32x32.png',
            type: 'image/png',
        },
        {
            rel: 'icon',
            sizes: '96x96',
            href: '/static/android-icon-96x96.png',
            type: 'image/png',
        },
        {
            rel: 'icon',
            sizes: '16x16',
            href: '/static/android-icon-16x16.png',
            type: 'image/png',
        },
    ],
})
</script>
