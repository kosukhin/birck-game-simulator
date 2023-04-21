export class SDevice {
    #MOBILE_WIDTH_LIMIT = 1024

    isMobile() {
        if (!window) {
            return false
        }

        return window.innerWidth <= this.#MOBILE_WIDTH_LIMIT
    }
}
