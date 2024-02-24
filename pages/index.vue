<template>
  <div class="main">
    <div class="middle mb-4">
      <el-carousel class="carousel" height="400px">
        <el-carousel-item v-for="item in 3" :key="item">
          <nuxt-img :src="`/images/banner/slide${item}-min.jpg`" width="1000" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="middle">
      <h2 class="mb-4">{{ $t('About project') }}</h2>
      <div class="article">
        <p class="mb-4">
          {{ $t('Welcome to the BrickGame Simulator project!') }}
        </p>
        <p class="mb-4">
          {{
            $t(
              'This project is being developed as a work for an open source portfolio. So that the author of the project could show his skills on the example of this work.'
            )
          }}
        </p>
        <p class="mb-4">
          {{
            $t(
              'Perhaps in the future the project will grow into something more than a work for a portfolio. You can help the author in this difficult task and create your own game based on this simulator. You will find a detailed tutorial on how to make your own game here:'
            )
          }}
          <nuxt-link to="/new-game/">
            <el-link type="primary">{{ $t('Create new game') }} </el-link>
          </nuxt-link>
        </p>
      </div>
    </div>
    <div class="middle">
      <h2 class="mb-4">{{ $t('Popular games') }}</h2>
      <div class="games-list">
        <GameCard :game="games[0]" />
        <GameCard :game="games[2]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import GameCard from '~/src/common/components/GameCard/GameCard.vue'
import { games } from '~/src/common/providers/games'
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
}

.carousel {
  border-radius: 20px;
  width: 1000px;
  max-width: 100%;
}
</style>
