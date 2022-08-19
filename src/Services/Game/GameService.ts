import Shapes from "~~/src/Data/Shapes";
import ObjectsHelper from "~~/src/Helpers/ObjectsHelper";
import { Shape } from "~~/src/Library/Shape";

export class GameService {
    // Скорость игры
    public cycleSpeed;
    public score;
    public isGameOver;
    private runHandler;

    constructor() {
        this.score = ref(0);
        this.cycleSpeed = ref(500);
        this.isGameOver = ref(false);
    }

    /**
     * Зацикливаем обработчик игры на определенной скорости
     * @param runHandler
     */
    run(runHandler: () => void) {
        this.runHandler = runHandler;
        const app = useNuxtApp();
        setTimeout(() => {
            if (app.$services.grid.checkGameOver()) {
                app.$services.game.isGameOver.value = true;
                return;
            }

            runHandler.call(this) && this.run(runHandler);
        }, this.cycleSpeed.value);
    }

    nextFrame() {
        this.runHandler.call(this);
    }

    addRandomShapeToGrid() {
        const app = useNuxtApp();
        const index = Math.round(Math.random()*(Shapes.length - 1));
        app.$services.logger.log('shape', index);
        const bitmap = ObjectsHelper.clone(Shapes[index]);
        const shape = new Shape(bitmap);
        const {round} = Math;
        shape.setPosition(round(app.$services.grid.width / 2) - round(shape.width/2), 0);
        app.$services.grid.addActiveShape(shape);
        app.$services.logger.log('shape_form', 'new shape');
    }
}