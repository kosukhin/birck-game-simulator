<template>
    <div class="menu screen">
        <a class="menu_item" @click.prevent="$emit('open', 'start')" href="#">
            Начать игру
        </a>
        <a class="menu_item" @click.prevent="$emit('open', 'settings')" href="#">
            Настройки
        </a>
    </div>
</template>

<style scoped>
    .menu_item {
        cursor: pointer;
    }
</style>
