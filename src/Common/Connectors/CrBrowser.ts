/**
 * Коннектор для передачи функционала браузера в приложение
 */
export class CrBrowser {
    /**
     * Добавляет обработчик события на элемент
     * @param element
     * @param event
     * @param callback
     */
    on(element: any, event: string, callback: (e) => void) {
        element.addEventListener(event, callback)
    }

    /**
     * Вывод в консоль
     * @param values
     */
    consoleLog(...values: any[]) {
        const { log } = console
        log(...values)
    }

    /**
     * Запросить следующий фрейм анимации, это
     * нужно чтобы на забивать очередь задач
     */
    requestAnimationFrame(): Promise<void> {
        return new Promise((resolve) => {
            if (process.client && window) {
                window.requestAnimationFrame(() => {
                    resolve()
                })
            } else {
                resolve()
            }
        })
    }
}
