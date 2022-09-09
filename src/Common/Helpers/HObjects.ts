import merge from 'lodash.merge'
import { HLog } from '~~/src/Common/Helpers/HLog'

/**
 * Помощник для работы над объектами
 */
export class HObjects {
    /**
     * Клонирует объект, не выдает ошибок при клонировании
     * в случае ошибки вернет пустой объект
     * @param object
     * @returns
     */
    static clone(object: any): any {
        let result = {}

        try {
            result = JSON.parse(JSON.stringify(object))
        } catch (e) {
            HLog.log('helpers', 'clone error', e)
        }

        return result
    }

    /**
     * Соединяет 2 объекта и не мутирует их
     * @param object1
     * @param object2
     * @returns
     */
    static merge(object1, object2) {
        const result = {}
        merge(result, object1, object2)

        return result
    }
}
