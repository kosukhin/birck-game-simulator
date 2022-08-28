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
        const app = useNuxtApp()

        return app.$services[name]
    }
}
