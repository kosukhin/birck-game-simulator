<template>
  <div>
    {{ $services.lang.t('Hello') }}
    <p>{{ counter }}</p>
    <button @click="plus">+</button>
    <button @click="minus">-</button>
  </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";

let counter = ref(1);

const plus = () => {
  counter.value++
  console.log('plus')
}

const minus = () => {
  counter.value--
  console.log('minus')
}
</script>