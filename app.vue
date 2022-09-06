<template>
    <header class="header">header</header>
    <NuxtPage />
    <footer class="footer">footer</footer>
</template>

<script lang="ts" setup>
import { useService } from '~~/src/Common/Helpers/HService'
import { SHooks } from '~~/src/Common/Services/SHooks'

useService<SHooks>('hooks').init.runSubscribers()
</script>
