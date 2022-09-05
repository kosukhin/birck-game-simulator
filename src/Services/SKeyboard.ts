import { useService } from '~~/src/Helpers/HService'
import { Observable } from '~~/src/Library/Observable'
import { SHooks } from '~~/src/Services/SHooks'
import { SConnectors } from '~~/src/Services/SConnectors'
import { TKeyboardSubscriber } from '~~/src/Types/KeyboardTypes'
import { HLog } from '~~/src/Helpers/HLog'

/**
 * Коды управляющих клавиш
 */
export enum KeyCode {
    W = 'KeyW',
    A = 'KeyA',
    S = 'KeyS',
    D = 'KeyD',
}

/**
 * Сервис взаимодействия с клавиатурой
 */
export class SKeyboard extends Observable<TKeyboardSubscriber> {
    afterInit(hooks: SHooks) {
        hooks.init.registerSubscriber(() => {
            process.client && this.keyPressHandler()
        })
    }

    /**
     * Регистрирует глобальный хэндлер обработки нажатий клавиатуры
     */
    keyPressHandler() {
        useService<SConnectors>('connectors').browser.on(
            window,
            'keypress',
            (e) => {
                const key = e.code
                HLog.log('keyboard', 'key', key)
                this.runSubscribers(key)
            }
        )
    }
}
