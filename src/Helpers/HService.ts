/**
 * Хэлпер для получения серисов
 */
export class HService {
    static get<T>(name: string): T {
        const app = useNuxtApp()

        return app.$services[name]
    }
}
