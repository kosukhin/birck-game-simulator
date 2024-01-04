<template>
  <div>
    <h1>Бластероид</h1>
    <div ref="canvasWrapper"></div>
    <KeyboardHint @pause="game.pause">
      <SpaceHint />
      <br />
    </KeyboardHint>
  </div>
</template>

<script lang="ts" setup>
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { blasteroidController } from '~~/app/controllers/blasteroidController'

const { canvasWrapper, game } = blasteroidController.setup()
</script>
