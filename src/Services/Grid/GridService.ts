
export class GridService {
    private width = 20;
    private height = 30;
    private girdArray: number[][] = [];

    constructor() {
        this.clearGrid();
    }

    getGrid() {
        return this.girdArray;
    }

    clearGrid() {
        for (let i = 0; i < this.width; i++) {
            this.girdArray[i] || (this.girdArray[i] = []);

            for (let j = 0; j < this.height; j++) {
                this.girdArray[i][j] = Math.round(Math.random());
            }
        }
    }
}