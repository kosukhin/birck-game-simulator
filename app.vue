<template>
  <div>
      <Tetris />
  </div>
</template>

<script lang="ts" setup>
import Tetris from "~/src/Components/Contexts/Tetris/Tetris.vue";
</script>

<style>
* {
    font-family: Arial, sans-serif;
    font-size: 16px;
}

a {
    color: cornflowerblue;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

body {
    background: #eee;
}

.screen {
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    background: #fff;
    box-sizing: border-box;
    padding-top: 12px;
}

.back {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 12px;
    z-index: 1;
}
</style>
