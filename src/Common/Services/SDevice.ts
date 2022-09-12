/**
 * Сервис для определения типа устройства
 */
export class SDevice {
    #MOBILE_WIDTH_LIMIT = 1024

    /**
     * Определяет является ли устройство мобильным
     */
    isMobile() {
        if (!window) {
            return false
        }

        return window.innerWidth <= this.#MOBILE_WIDTH_LIMIT
    }
}
