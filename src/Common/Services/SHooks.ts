import { Observable } from '~~/src/Common/Library/Observable'

/**
 * Хуки приложения
 */
export class SHooks {
    /** Приложение инициалиировано */
    init = new Observable<() => void>()
    /** Хук перед инициализацией игр в симуляторе */
    gamesResolving = new Observable<(gamesList: any) => void>()
}
