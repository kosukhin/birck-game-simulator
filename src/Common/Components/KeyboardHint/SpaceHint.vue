<template>
    <b class="keyhint__text">
        {{ $services.lang.t('Fire') }}
    </b>
    <div class="keyhint__row">
        <div class="key key--as5" @click="onKeyPress('Space')">
            <span>Space</span>
            <em>Shoot</em>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useService } from '~~/src/Common/Helpers/HService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'

const onKeyPress = (keyCode: string) => {
    useService<SKeyboard>('keyboard').triggerKeyPress(keyCode)
}
</script>
