<template>
  <div class="middle">
    <Simulator :action="$route.params.action" />
  </div>
</template>

<script setup>
import Simulator from '~~/src/Common/Components/Simulator/Simulator.vue'
</script>

<style lang="scss" scoped>
.middle {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
