import config, { Config } from '~~/config/config'

export class SConfig {
    config!: Config

    async afterInit() {
        if (process.env.NODE_ENV !== 'production') {
            try {
                await import('~~/config/config-local')
            } catch {
                // Файл локального конфига отсутствует
            }
        }

        this.config = config
    }
}
