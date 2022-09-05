/**
 * Сервис логировния сообщений,
 * полезен для отладки и профилирования
 */
export class SLogger {
    /**
     * Конфиг тэгов отладки
     */
    private config = {
        limit: false,
        shape: false,
        max: false,
        shape_form: false,
        fulltrace: false,
        snake: true,
        keyboard: false,
    }

    /**
     * Помещает в лог новое сообщение, если тэг включен
     * @param tag
     * @param rest
     * @returns
     */
    log(tag: string, ...rest: any[]) {
        if (!this.config[tag]) {
            return
        }

        const { log } = console
        log(`[${tag}]`, ...rest)
    }
}
