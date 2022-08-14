<template>
    <div class="game screen">
        <a @click.prevent="$emit('back')" class="back" href="#">
            {{ $services.lang.t('Back') }} &rarr;
        </a>
        <GridView />
    </div>
</template>

<script setup>
import GridView from "@/src/Components/Contexts/GridView/GridView.vue";
</script>
