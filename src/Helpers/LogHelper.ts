/**
 * Помощник логирования
 */
export default new class LogHelper {
    log(key: string, ...messages: string[]) {
        const app = useNuxtApp();
        app.$services.logger.log(key, ...messages);
    }
}
