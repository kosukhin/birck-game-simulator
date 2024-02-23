<template>
  <b class="keyhint__text">
    {{ $t('Fire') }}
  </b>
  <div class="keyhint__row">
    <div class="key key--as5" @click="onKeyPress('Space')">
      <span>Space</span>
      <em>Shoot</em>
    </div>
  </div>
</template>

<script lang="ts" setup>
const onKeyPress = (keyCode: string) => {
  console.log(keyCode)
}
</script>

<style lang="scss" scoped>
.keyhint__text {
  @include media648 {
    display: none;
  }
}

@include media648 {
  .keyhint__row {
    position: relative;
    width: 100%;
  }
}

.key--as5 {
  @include media648 {
    position: absolute;
    bottom: 100%;
    right: 0;
    width: 60px;
    height: 60px;
  }
}
</style>
