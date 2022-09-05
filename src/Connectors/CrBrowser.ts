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
}