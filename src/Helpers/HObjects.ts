/**
 * Помощник для работы над объектами
 */
export default new class HObjects {
    /**
     * Клонирует объект
     * @param object
     * @returns
     */
    clone(object: any) {
        return JSON.parse(JSON.stringify(object));
    }
}
