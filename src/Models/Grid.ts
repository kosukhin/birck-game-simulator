import { Ref } from "nuxt/dist/app/compat/capi";
import { Shape } from "~~/src/Models/Shape";
import { TGrid } from "~~/src/Types/GridTypes";

/**
 * Представление сетки, позволяет выводить
 * на экран результаты игры, позволяет выполнять
 * манипуляции над пикселями
 */
export class Grid {
    #width: Ref<number>; // Ширина сетки
    #height: Ref<number>; // Высота сетки
    #bgBitmap: Ref<TGrid>;    // Бэкграунд сетки
    #shapes: Ref<Shape[]>;   // Активные фигуры на сетке

    constructor(params) {
        const {
            height=15,
            width=10,
            bgBitmap = []
        } = params;
        this.#height = ref(height);
        this.#width = ref(width);
        this.#bgBitmap = ref(bgBitmap);
        this.#shapes = ref([]);
    }

    get width(): number {
        return this.#width.value;
    }

    get height(): number {
        return this.#height.value;
    }

    /**
     * Рендерит сетку
     */
    get grid() {
        return this.#bgBitmap;
    }

    setGrid(bitmap: TGrid) {
        this.#bgBitmap.value = bitmap;
    }

    /**
     * Добавляет фигуру на сетку
     * @param shape
     */
    addShape(shape: Shape) {
        this.#shapes.value = [...this.#shapes.value, shape];
    }

    /**
     * Очищает все фигуры с сетки
     */
    clearShapes() {
        this.#shapes.value = [];
    }

    getFirstShape() {
        return this.#shapes[0];
    }
}
