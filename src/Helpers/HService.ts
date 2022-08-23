/**
 * Хэлпер для получения серисов
 */
export default new class HService {
    get<T>(name: string): T {
        const app = useNuxtApp();

        return app.$services[name];
    }
}
