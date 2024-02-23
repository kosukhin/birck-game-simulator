<template>
  <div class="simulator middle">
    <h1>{{ $t('Games') }}</h1>
    <div class="games-list">
      <GameCard v-for="game in games" :key="game.title" :game="game" />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameCard from '~/src/common/components/GameCard/GameCard.vue'
import { games } from '~/src/common/providers/games'
</script>

<style lang="scss" scoped>
.simulator {
  display: flex;
  flex-direction: column;
}
</style>
