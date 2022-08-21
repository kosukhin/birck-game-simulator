/**
 * Помощник логирования, он полезен в местах
 * где нету доступа к app и не хочется ради логирования
 * вызывать useNuxtApp
 */
export default new class LogHelper {
    /**
     * Добавляет сообщение в логгер
     * @param tag
     * @param messages
     */
    log(tag: string, ...messages: string[]) {
        const app = useNuxtApp();
        app.$services.logger.log(tag, ...messages);
    }
}
