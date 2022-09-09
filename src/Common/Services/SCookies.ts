import Cookies from 'js-cookie'

/**
 * Сервис для работы с куками
 */
export class SCookies {
    /**
     * Устанавливает куку на год
     * @param key
     * @param value
     */
    set(key: string, value: string) {
        Cookies.set(key, value, { expires: 365 })
    }

    /**
     * Читает куку по ключу
     * @param key
     * @returns
     */
    get(key: string) {
        return Cookies.get(key)
    }

    /**
     * Удаляет куку ключу
     * @param key
     */
    remove(key: string) {
        Cookies.remove(key)
    }
}
