import Shapes from "~~/src/Data/Shapes";
import { Shape } from "~~/src/Library/Shape";

export class GameService {
    // Скорость игры
    private cycleSpeed = 500;

    /**
     * Зацикливаем обработчик игры на определенной скорости
     * @param runHandler
     */
    run(runHandler: () => void) {
        setTimeout(() => {
            runHandler.call(this) && this.run(runHandler);
        }, this.cycleSpeed);
    }

    addRandomShapeToGrid() {
        const app = useNuxtApp();
        const bitmap = Shapes[Math.round(Math.random()*Shapes.length) - 1];
        const shape = new Shape(bitmap);
        app.$services.grid.addActiveShape(shape);
    }
}