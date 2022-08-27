<template>
    <div class="menu screen">
        <a class="menu_item" href="#" @click.prevent="$emit('open', 'start')">
            {{ $services.lang.t('Start game') }}
        </a>
        <a
            class="menu_item"
            href="#"
            @click.prevent="$emit('open', 'settings')"
        >
            {{ $services.lang.t('Settings') }}
        </a>
    </div>
</template>

<style scoped>
.menu_item {
    cursor: pointer;
}
</style>
