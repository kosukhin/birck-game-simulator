<template>
  <nuxt-link :to="game.link" class="game-card-wrapper">
    <article class="game-card">
      <div class="game-card__photo">
        <nuxt-img :alt="game.title" :src="game.photo" width="200" />
      </div>
      <div class="game-card__content">
        <div class="game-card__title">
          {{ game.title }}
        </div>
        <div class="game-card__description">
          {{ game.description }}
        </div>
      </div>
    </article>
  </nuxt-link>
</template>

<script lang="ts" setup>
defineProps({
  game: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.game-card-wrapper {
  flex: 45%;

  &:hover {
    text-decoration: none;
  }
}

.game-card {
  border: solid 1px $c_black;
  border-radius: 20px;
  display: flex;
  flex: 1;
  overflow: hidden;
}

.game-card__photo {
  background: $c_tetris_screen;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    object-fit: contain;
    height: 100%;
  }
}

.game-card__content {
  padding: 20px;
  background: $c_white;
  flex: 1;
}

.game-card__title {
  font-size: 20px;
  margin-bottom: 15px;
}

.game-card__description {
  height: 108px;
  overflow: hidden;
}
</style>
