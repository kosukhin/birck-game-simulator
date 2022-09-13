import debounce from 'lodash.debounce'

/**
 * Вспомогательные функции для приложения
 */
export class HApp {
    static #uniqCounter = 99

    /**
     * Таймаут в формате промиса
     * @param ms время задержки в мс
     * @returns
     */
    static wait(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }

    /**
     * Врапер для дебонс функции, реализация лодаш
     * @param callback
     * @param speed
     * @returns
     */
    static debounce(callback: () => void, speed: number) {
        return debounce(callback, speed)
    }

    /**
     * Генерирует уникальный id может с префиксом может без
     * @param prefix
     * @returns
     */
    static uniqueId(prefix?: string) {
        HApp.#uniqCounter++
        return (
            'app_' + (prefix ? prefix + HApp.#uniqCounter : HApp.#uniqCounter)
        )
    }
}
