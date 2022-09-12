import { Observable } from '~~/src/Common/Library/Observable'

export interface IDrawer {
    name: string
    component: () => unknown
    options: unknown
    direction: 'rtl' | 'ltr' | 'btt' | 'ttb'
}

/**
 * Сервис управления дроверами
 */
export class SDrawer {
    /** Событие открытия дровера */
    opening = new Observable<(drawer: IDrawer) => void>()
    /** Событие закрытия дровера */
    closing = new Observable<(name: string) => void>()

    /**
     * Дергает событие для открытия нового дровера
     * @param drawer
     */
    open(drawer: IDrawer) {
        this.opening.runSubscribers(drawer)
    }

    /**
     * Дергает событие для закрытия дровера
     * @param name
     */
    close(name: string) {
        this.closing.runSubscribers(name)
    }
}
