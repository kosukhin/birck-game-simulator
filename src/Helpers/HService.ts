/**
 * Хэлпер для получения серисов
 */
export class HService {
    get<T>(name: string): T {
        const app = useNuxtApp()

        return app.$services[name]
    }
}

export default new HService()
