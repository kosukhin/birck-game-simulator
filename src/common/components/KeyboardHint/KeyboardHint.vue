<template>
  <div ref="allTouches" class="keyhint">
    <b class="keyhint__text">
      {{ 'Controls' }}
    </b>
    <div class="keyhint__row">
      <div ref="keyW" class="key key--w">
        <span>W</span>
        <em>up</em>
      </div>
    </div>
    <div class="keyhint__row">
      <div ref="keyA" class="key key--a">
        <span>A</span>
        <em>left</em>
      </div>
      <div ref="keyS" class="key key--s">
        <span>S</span>
        <em>down</em>
      </div>
      <div ref="keyD" class="key key--d">
        <span>D</span>
        <em>right</em>
      </div>
    </div>
    <br />
    <slot></slot>
    <div class="keyhint__row">
      <div class="key--control">
        <div class="key__circle" @click="$emit('pause')"></div>
        <span>{{ 'pause' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useService } from '~~/src/common/utils/HService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'

const keyboard = useService<SKeyboard>('keyboard')
const keyW = ref()
const keyA = ref()
const keyS = ref()
const keyD = ref()
const allTouches = ref()

onMounted(() => {
  allTouches.value.addEventListener('touchend', () => {
    keyboard.stopTriggerKeyPress()
  })
  keyW.value.addEventListener('touchstart', () =>
    keyboard.beginTriggerKeyPress('KeyW')
  )
  keyA.value.addEventListener('touchstart', () =>
    keyboard.beginTriggerKeyPress('KeyA')
  )
  keyS.value.addEventListener('touchstart', () =>
    keyboard.beginTriggerKeyPress('KeyS')
  )
  keyD.value.addEventListener('touchstart', () =>
    keyboard.beginTriggerKeyPress('KeyD')
  )
})
</script>

<style lang="scss">
.keyhint {
  position: static;
  margin-top: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  user-select: none;
}

.keyhint__text {
  display: block;
  margin-bottom: 5px;
}

.keyhint__row {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
}

.key__circle {
  display: block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: $c_white;
  box-shadow: 0 2px 2px $c_black;
  cursor: pointer;
  transition: box-shadow 0.2s linear;

  &:active {
    box-shadow: none;
  }
}

.key--control {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.key {
  $self: &;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: solid 1px $c_black;
  margin-right: 5px;
  font-weight: 600;
  box-shadow: 0 2px 2px $c_black;
  background: $c_white;
  cursor: pointer;
  transition: box-shadow 0.2s linear;

  &:active {
    box-shadow: none;
  }

  &--as5 {
    width: calc(40px * 5 + 5px * 4);

    @include media648 {
      width: 40px;
    }
  }

  @include media648 {
    $baseBottom: 200px;
    border-radius: 100%;
    position: fixed;
    bottom: $baseBottom;
    z-index: 99;
    width: 50px;
    height: 50px;

    span {
      font-size: 0;
    }

    &#{$self}--s,
    &#{$self}--a {
      left: 10px;
    }

    &#{$self}--w,
    &#{$self}--d {
      right: 10px;
    }

    &#{$self}--w {
      bottom: calc($baseBottom + 60px);
    }

    &#{$self}--s {
      bottom: calc($baseBottom - 60px);
      right: 10px;
      left: auto;
      margin: 0;
    }
  }

  &:last-child {
    margin: 0;
  }

  span,
  em {
    line-height: 100%;
  }

  em {
    font-size: 9px;
  }
}
</style>
