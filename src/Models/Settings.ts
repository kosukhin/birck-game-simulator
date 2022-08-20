export class Settings {
    #gridWidth;
    #gridHeight;

    constructor(params) {
        const {
            height=15,
            width=10
        } = params;
        this.#gridHeight = ref(height);
        this.#gridWidth = ref(width);
    }
}