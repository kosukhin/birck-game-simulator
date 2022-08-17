
export class LoggerService {
    private config = {
        limit: true,
        shape: true,
    }

    log(tag, ...rest) {
        if (!this.config[tag]) {
            return;
        }

        console.log(`[${tag}]`, ...rest);
    }
}