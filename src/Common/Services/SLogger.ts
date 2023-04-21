export class SLogger {
    private config = new Map([
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

    log(tag: string, ...rest: any[]) {
        if (!this.config.get(tag)) {
            return
        }

        const { log } = console
        log(`[${tag}]`, ...rest)
    }
}
