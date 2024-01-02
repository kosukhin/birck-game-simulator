<template>
  <div>
    <RouterLink to="/simulator/snake/">Классическая змейка</RouterLink>
    <h1>Змейка 3Д</h1>
    <div class="row">
      <div>
        <div ref="canvasWrapper"></div>
      </div>
    </div>
    <KeyboardHint @pause="game.pause()" />
  </div>
</template>

<script setup lang="ts">
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { snakeController } from '~~/app/appModules/snake/snakeController'

const canvasWrapper = snakeController.setup()
</script>
