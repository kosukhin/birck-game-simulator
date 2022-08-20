import { Ref } from "nuxt/dist/app/compat/capi";

/**
 * Настройки для игр.
 * Параметры здесь не должны синхронизоваться с другими сущностями.
 * синхронизация происходит только после применения этих настроек
 */
export class Settings {
    #gridWidth: Ref<number>;    // Ширина сетки
    #gridHeight: Ref<number>;   // Высота сетки

    constructor(params) {
        const {
            height=15,
            width=10
        } = params;
        this.#gridHeight = ref(height);
        this.#gridWidth = ref(width);
    }

    get gridWidth(): number {
        return this.#gridWidth.value;
    }

    get gridHeight(): number {
        return this.#gridHeight.value;
    }
}
