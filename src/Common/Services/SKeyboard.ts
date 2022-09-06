import { useService } from '~~/src/Common/Helpers/HService'
import { Observable } from '~~/src/Common/Library/Observable'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { TKeyboardSubscriber } from '~~/src/Common/Types/KeyboardTypes'
import { HLog } from '~~/src/Common/Helpers/HLog'

/**
 * Коды управляющих клавиш
 */
export enum KeyCode {
    W = 'KeyW',
    A = 'KeyA',
    S = 'KeyS',
    D = 'KeyD',
    SPC = 'Space',
}

/**
 * Сервис взаимодействия с клавиатурой
 */
export class SKeyboard extends Observable<TKeyboardSubscriber> {
    /**
     * После инициализации сервисов, нужно подписаться на хук init
     * @param hooks
     */
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
