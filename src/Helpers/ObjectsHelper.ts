export default new class ObjectHelper {
    /**
     * Клонирует объект
     * @param object
     * @returns
     */
    clone(object: any) {
        return JSON.parse(JSON.stringify(object));
    }
}
