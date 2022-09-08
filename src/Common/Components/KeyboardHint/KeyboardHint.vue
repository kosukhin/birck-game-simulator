<template>
    <div class="keyhint">
        <b class="keyhint__text">
            {{ $services.lang.t('Controls') }}
        </b>
        <div class="keyhint__row">
            <div class="key" @click="onKeyPress('KeyW')">
                <span>W</span>
                <em>up</em>
            </div>
        </div>
        <div class="keyhint__row">
            <div class="key" @click="onKeyPress('KeyA')">
                <span>A</span>
                <em>left</em>
            </div>
            <div class="key" @click="onKeyPress('KeyS')">
                <span>S</span>
                <em>down</em>
            </div>
            <div class="key" @click="onKeyPress('KeyD')">
                <span>D</span>
                <em>right</em>
            </div>
        </div>
        <br />
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { useService } from '~~/src/Common/Helpers/HService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'

const onKeyPress = (keyCode: string) => {
    useService<SKeyboard>('keyboard').triggerKeyPress(keyCode)
}
</script>

<style lang="scss">
.keyhint {
    position: absolute;
    top: 100%;
    margin-top: 20px;
    left: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    user-select: none;
}

.keyhint__text {
    display: block;
    margin-bottom: 5px;
}

.keyhint__row {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
}

.key {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    border: solid 1px $c_black;
    margin-right: 5px;
    font-weight: 600;
    box-shadow: 0 2px 2px $c_black;
    background: $c_white;
    cursor: pointer;
    transition: box-shadow 0.2s linear;

    &:active {
        box-shadow: none;
    }

    &--as5 {
        width: calc(40px * 5 + 5px * 4);
    }

    &:last-child {
        margin: 0;
    }

    span,
    em {
        line-height: 100%;
    }

    em {
        font-size: 9px;
    }
}
</style>
