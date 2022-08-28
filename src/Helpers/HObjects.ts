import { HLog } from '~~/src/Helpers/HLog'

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
}
