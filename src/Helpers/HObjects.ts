/**
 * Помощник для работы над объектами
 */
export class HObjects {
    /**
     * Клонирует объект
     * @param object
     * @returns
     */
    static clone(object: any) {
        return JSON.parse(JSON.stringify(object))
    }
}
