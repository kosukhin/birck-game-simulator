import { Observable } from '~~/src/Common/Library/Observable'

export interface IDrawer {
    name: string
    component: () => unknown
    options: unknown
    direction: 'rtl' | 'ltr' | 'btt' | 'ttb'
}

export class SDrawer {
    opening = new Observable<(drawer: IDrawer) => void>()
    closing = new Observable<(name: string) => void>()

    open(drawer: IDrawer) {
        this.opening.runSubscribers(drawer)
    }

    close(name: string) {
        this.closing.runSubscribers(name)
    }
}
