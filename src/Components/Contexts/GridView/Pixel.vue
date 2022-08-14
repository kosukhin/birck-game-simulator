<template>
    <div :class="['pixel', {filled}]">&nbsp;</div>
</template>

<script setup lang="ts">
defineProps({
    filled: {
        type: Number,
        default: 0,
    }
})
</script>

<style scoped>
.pixel {
    width: 10px;
    height: 10px;
    border: solid 1px #eee;
    background: #fff;
}

.filled {
    background: pink;
}
</style>
