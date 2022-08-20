/**
 * Представление сетки, позволяет выводить
 * на экран результаты игры, позволяет выполнять
 * манипуляции над пикселями
 */
export class Grid {
    /**
     * Ширина сетки
     */
    #width;

    /**
     * Высота сетки
     */
    #height;

    /**
     * Бэкграунд сетки
     */
    #background;

    /**
     * Активные фигуры на сетке
     */
    #shapes = [];

    constructor(params) {
        const {
            height=15,
            width=10,
            background=[],
            shapes=[]
        } = params;
        this.#height = ref(height);
        this.#width = ref(width);
        this.#background = ref(background);
        this.#shapes = ref(shapes);
    }

    /**
     * Рендерим сетку
     */
    render() {
        return this.#background;
    }
}