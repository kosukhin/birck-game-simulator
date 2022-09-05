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
     * @param tag тэг сообщения, нужен чтобы отключать\включать сообщения
     * @param messages набор сообщений
     */
    static log(tag: string, ...messages: any[]) {
        HService.get<SLogger>('logger').log(tag, ...messages)
    }
}

/**
 * Частично примененная функция для логирования по тэгу
 * @param tag
 * @returns
 */
export function useLog(tag): (...messages: any[]) => void {
    return (...messages: any[]) => {
        HLog.log(tag, ...messages)
    }
}
