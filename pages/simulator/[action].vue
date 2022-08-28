<template>
    <div>
        <Simulator :action="$route.params.action" />
    </div>
</template>

<script setup>
import Simulator from '~~/src/Components/Contexts/Simulator/Simulator.vue'
</script>
