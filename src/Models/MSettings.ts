import { Ref } from "nuxt/dist/app/compat/capi";

interface ISettings {
    height?: number;
    width?: number;
}

/**
 * Настройки для игр.
 * Параметры здесь не должны синхронизоваться с другими сущностями.
 * синхронизация происходит только после применения этих настроек
 */
export class MSettings {
    #gridWidth: Ref<number>;    // Ширина сетки
    #gridHeight: Ref<number>;   // Высота сетки

    constructor(params: ISettings) {
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
