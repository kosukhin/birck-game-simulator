<template>
  <div class="simulator middle">
    <h1>{{ $services.lang.t('Games') }}</h1>
    <div class="games-list">
      <GameCard v-for="game in games()" :key="game.title" :game="game" />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameCard from '~~/src/Common/Components/GameCard/GameCard.vue'
import { games } from '~~/src/Common/Data/Games'
</script>

<style lang="scss" scoped>
.simulator {
  display: flex;
  flex-direction: column;
}
</style>
