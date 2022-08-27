<template>
    <div :class="['pixel', { filled }]">&nbsp;</div>
</template>

<script setup lang="ts">
defineProps({
    filled: {
        type: Number,
        default: 0,
    },
})
</script>

<style lang="scss" scoped>
.pixel {
    width: 10px;
    height: 10px;
    border: solid 1px transparent;
}

.filled {
    border: solid 1px $c_pixel;
    position: relative;
}

.filled::before {
    content: '';
    display: block;
    position: absolute;
    top: 2px;
    left: 2px;
    width: 6px;
    height: 6px;
    background: $c_pixel;
}
</style>
