<template>
    <div>
        <Simulator :action="$route.params.action" />
    </div>
</template>

<script setup>
import Simulator from '~~/src/Common/Components/Simulator/Simulator.vue'
</script>
