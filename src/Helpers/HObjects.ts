/**
 * Помощник для работы над объектами
 */
export class HObjects {
    /**
     * Клонирует объект
     * @param object
     * @returns
     */
    clone(object: any) {
        return JSON.parse(JSON.stringify(object))
    }
}

export default new HObjects()
