/**
 * Вспомогательные функции для приложения
 */
export default new (class HApp {
    /**
     * Таймаут в формате промиса
     * @param ms
     * @returns
     */
    wait(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }
})()
