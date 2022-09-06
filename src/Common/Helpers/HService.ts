import services from '~~/src/Injections/Services'

/**
 * Хэлпер для получения серисов
 */
export class HService {
    /**
     * Возвращает инстанс сервиса, по его
     * зарегистрированному имени
     * @param name название сервиса из injection плагина
     * @returns инстанс сервиса
     */
    static get<T>(name: string): T {
        return services[name]
    }
}

/**
 * Получение сервиса в функциональном стиле
 * @param name
 * @returns
 */
export function useService<T>(name: string): T {
    return HService.get<T>(name)
}
