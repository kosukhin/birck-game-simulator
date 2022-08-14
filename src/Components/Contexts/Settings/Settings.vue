<template>
    <div class="settings screen">
        <a @click.prevent="$emit('back')" class="back" href="#">Назад &rarr;</a>
        {{ $services.lang.t('Settings') }}
    </div>
</template>
