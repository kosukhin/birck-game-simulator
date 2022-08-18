import Shapes from "~~/src/Data/Shapes";
import { Shape } from "~~/src/Library/Shape";

export class GameService {
    // Скорость игры
    public cycleSpeed;
    public score;

    constructor() {
        this.score = ref(0);
        this.cycleSpeed = ref(500);
    }

    /**
     * Зацикливаем обработчик игры на определенной скорости
     * @param runHandler
     */
    run(runHandler: () => void) {
        setTimeout(() => {
            runHandler.call(this) && this.run(runHandler);
        }, this.cycleSpeed.value);
    }

    addRandomShapeToGrid() {
        const app = useNuxtApp();
        const index = Math.round(Math.random()*(Shapes.length - 1));
        app.$services.logger.log('shape', index);
        const bitmap = Shapes[index];
        const shape = new Shape(bitmap);
        const {round} = Math;
        shape.setPosition(round(app.$services.grid.width / 2) - round(shape.width/2), 0);
        app.$services.grid.addActiveShape(shape);
    }
}