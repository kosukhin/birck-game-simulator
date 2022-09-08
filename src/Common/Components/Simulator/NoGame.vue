<template>
    <div class="game screen">
        <nuxt-link class="back" to="/simulator/">
            {{ $services.lang.t('Back') }} &rarr;
        </nuxt-link>
        <p>{{ $services.lang.t('Failed to load the game') }}</p>
        <p>{{ $services.lang.t('choose another one, please') }}</p>
    </div>
</template>
