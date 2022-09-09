<template>
    <header class="header">
        <div class="middle">header</div>
    </header>
    <div class="content">
        <div class="middle">
            <breadcrumbs />
        </div>
        <NuxtPage />
    </div>
    <footer class="footer">
        <div class="middle">footer</div>
    </footer>
</template>

<script lang="ts" setup>
import { useService } from '~~/src/Common/Helpers/HService'
import { SHooks } from '~~/src/Common/Services/SHooks'
import Breadcrumbs from '~~/src/Common/Components/Breadcrumbs/Breadcrumbs.vue'

useService<SHooks>('hooks').init.runSubscribers()
</script>
