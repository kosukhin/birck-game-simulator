
export class LoggerService {
    private config = {
        limit: true,
        shape: false,
        max: true,
    }

    log(tag, ...rest) {
        if (!this.config[tag]) {
            return;
        }

        console.log(`[${tag}]`, ...rest);
    }
}