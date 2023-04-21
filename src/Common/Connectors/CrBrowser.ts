export class CrBrowser {
    on(element: any, event: string, callback: (e) => void) {
        element.addEventListener(event, callback)
    }

    consoleLog(...values: any[]) {
        const { log } = console
        log(...values)
    }

    requestAnimationFrame(callback: () => void) {
        if (window) {
            window.requestAnimationFrame(callback)
        }
    }
}
