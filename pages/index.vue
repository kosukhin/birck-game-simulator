<template>
    <div class="main">
        <el-carousel class="carousel" height="400px">
            <el-carousel-item v-for="item in 3" :key="item">
                <img :src="`/static/banner/slide${item}-min.jpg`" />
            </el-carousel-item>
        </el-carousel>

        <div class="middle">
            <h2>{{ $services.lang.t('About project') }}</h2>
            <div class="article">asdf asdf asdf asdfasdf asdf asdf asdf</div>
        </div>

        <div class="middle">
            <h2>{{ $services.lang.t('Popular games') }}</h2>
            <div class="games-list">
                <GameCard :game="games()[0]" />
                <GameCard :game="games()[2]" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import GameCard from '~~/src/Common/Components/GameCard/GameCard.vue'
import { games } from '~~/src/Common/Data/Games'
</script>

<style scoped>
.main {
    display: flex;
    flex-direction: column;
}

.carousel {
    border-radius: 20px;
}
</style>
