import { Ref } from "nuxt/dist/app/compat/capi";
import { TGrid, TShapePosition } from "~~/src/Types/GridTypes";

/**
 * Представление фигуры, позволяет хранить
 * пиксельные формы, которые могут быть частью Grid
 */
export class Shape {
    #id = Shape.getNewShapeId();
    #bitmap: Ref<TGrid>;
    #x: Ref<number>;
    #y: Ref<number>;
    static #shapeIdCounter = 0;

    constructor(params) {
        const {
            x=0,
            y=0,
            bitmap=[]
        } = params;
        this.#bitmap = ref(bitmap);
        this.#x = ref(x);
        this.#y = ref(y);
    }

    get bitmap(): TGrid {
        return this.#bitmap.value;
    }

    get position(): TShapePosition {
        return [this.#x.value, this.#y.value];
    }

    get width(): number {
        return this.#bitmap.value[0].length;
    }

    set position(position: TShapePosition) {
        [this.#x.value, this.#y.value] = position;
    }

    moveY(by:number = 1) {
        this.#y.value += 1;
    }

    /**
     * Генерирует новый уникальный id для фигуры
     * @returns void
     */
    static getNewShapeId() {
        Shape.#shapeIdCounter = Shape.#shapeIdCounter + 1;

        return Shape.#shapeIdCounter;
    }
}
