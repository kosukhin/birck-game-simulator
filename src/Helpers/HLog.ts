import { HService } from '~~/src/Helpers/HService'
import { SLogger } from '~~/src/Services/SLogger'

/**
 * Помощник логирования, он полезен в местах
 * где нету доступа к app и не хочется ради логирования
 * вызывать useNuxtApp
 */
export class HLog {
    /**
     * Добавляет сообщение в логгер
     * @param tag
     * @param messages
     */
    static log(tag: string, ...messages: string[]) {
        HService.get<SLogger>('logger').log(tag, ...messages)
    }
}
