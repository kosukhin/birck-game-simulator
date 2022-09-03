<template>
    <NuxtPage />
</template>

<script lang="ts" setup>
import { useService } from '~~/src/Helpers/HService'
import { SHooks } from '~~/src/Services/SHooks'

useService<SHooks>('hooks').init.runSubscribers()
</script>
