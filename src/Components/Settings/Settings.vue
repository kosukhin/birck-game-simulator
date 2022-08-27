<template>
    <div class="settings screen">
        <a class="back" href="#" @click.prevent="$emit('back')">Назад &rarr;</a>
        {{ $services.lang.t('Settings') }}
    </div>
</template>
