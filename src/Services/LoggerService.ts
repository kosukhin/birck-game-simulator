/**
 * Сервис логировния сообщений,
 * полезен для отладки и профилирования
 */
export class LoggerService {
    /**
     * Конфиг тэгов отладки
     */
    private config = {
        limit: false,
        shape: false,
        max: false,
        shape_form: false,
        fulltrace: false,
    }

    /**
     * Помещает в лог новое сообщение, если тэг включен
     * @param tag
     * @param rest
     * @returns
     */
    log(tag: string, ...rest: string[]) {
        if (!this.config[tag]) {
            return;
        }

        console.log(`[${tag}]`, ...rest);
    }
}
