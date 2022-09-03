import { Observable } from '~~/src/Library/Observable'

/**
 * Хуки приложения
 */
export class SHooks {
    /** Приложение инициалиировано */
    init = new Observable<() => void>()
}
