
export class LoggerService {
    private config = {
        limit: false,
        shape: false,
        max: false,
        shape_form: false,
        fulltrace: true,
    }

    log(tag, ...rest) {
        if (!this.config[tag]) {
            return;
        }

        console.log(`[${tag}]`, ...rest);
    }
}
