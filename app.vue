<template>
    <header class="header">header</header>
    <NuxtPage />
    <footer class="footer">footer</footer>
</template>

<script lang="ts" setup>
import { useService } from '~~/src/Helpers/HService'
import { SHooks } from '~~/src/Services/SHooks'

useService<SHooks>('hooks').init.runSubscribers()
</script>

<style lang="scss" scoped>
.header {
    background: $c_black;
    border-bottom: solid 1px $c_white;
    color: $c_white;
    padding: 10px;
    box-sizing: border-box;
}

.footer {
    background: $c_black;
    min-height: 300px;
    color: $c_white;
    padding: 10px;
}
</style>
