import { useService } from '~~/src/Common/Helpers/HService'
import { Observable } from '~~/src/Common/Library/Observable'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { TKeyboardSubscriber } from '~~/src/Common/Types/KeyboardTypes'
import { EKeyCode } from '~~/src/Common/Types/GameTypes'

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

                if (key === EKeyCode.SPC) {
                    e.preventDefault()
                }

                this.runSubscribers(key)
            }
        )
    }

    /**
     * Симулирует нажатия клавиши
     * @param keyCode
     */
    triggerKeyPress(keyCode: string) {
        this.runSubscribers(keyCode)
    }
}
