<template>
  <div>
    <div v-for="(prop, propName) in props" :key="propName">
      <label>
        {{ propName }}
        <input :value="prop" type="number" @input="onInput(propName, $event)" />
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:rx', 'update:ry', 'update:rz'])
const props = defineProps({
  rx: {
    type: [String, Number],
    default: 0,
  },
  ry: {
    type: [String, Number],
    default: 0,
  },
  rz: {
    type: [String, Number],
    default: 0,
  },
})

const onInput = (prop: string, e: any) => {
  emit(`update:${prop}` as any, e.target.value)
}
</script>
