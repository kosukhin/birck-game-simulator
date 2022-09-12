/**
 * Сервис логировния сообщений,
 * полезен для отладки и профилирования
 */
export class SLogger {
    /** Конфиг тэгов отладки */
    #config = new Map([
        ['limit', false],
        ['shape', false],
        ['max', false],
        ['shape_form', false],
        ['fulltrace', false],
        ['snake', false],
        ['keyboard', false],
        ['game_resolving', false],
        ['tanks', false],
        ['bot', false],
        ['canvas', false],
    ])

    /**
     * Помещает в лог новое сообщение, если тэг включен
     * @param tag
     * @param rest
     * @returns
     */
    log(tag: string, ...rest: any[]) {
        if (!this.#config.get(tag)) {
            return
        }

        const { log } = console
        log(`[${tag}]`, ...rest)
    }
}
