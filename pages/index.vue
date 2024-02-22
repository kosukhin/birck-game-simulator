<template>
  <div class="main">
    <div class="middle">
      <el-carousel class="carousel" height="400px">
        <el-carousel-item v-for="item in 3" :key="item">
          <nuxt-img :src="`/images/banner/slide${item}-min.jpg`" width="1000" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="middle">
      <h2>{{ $t('About project') }}</h2>
      <div class="article">
        <p>
          {{ 'Welcome to the BrickGame Simulator project!' }}
        </p>
        <p>
          {{
            'This project is being developed as a work for an open source portfolio. So that the author of the project could show his skills on the example of this work.'
          }}
        </p>
        <p>
          {{
            'Perhaps in the future the project will grow into something more than a work for a portfolio. You can help the author in this difficult task and create your own game based on this simulator. You will find a detailed tutorial on how to make your own game here:'
          }}
          <nuxt-link to="/new-game/">
            <el-link type="primary">{{ 'Create new game' }} </el-link>
          </nuxt-link>
        </p>
      </div>
    </div>

    <div class="middle">
      <h2>{{ 'Popular games' }}</h2>
      <div class="games-list"></div>
    </div>
  </div>
</template>

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
