import { useService } from '~~/src/Helpers/HService'
import { Observable } from '~~/src/Library/Observable'
import { SHooks } from '~~/src/Services/SHooks'
import { SConnectors } from '~~/src/Services/SConnectors'
import { TKeyboardSubscriber } from '~~/src/Types/KeyboardTypes'

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
                const { key } = e
                this.runSubscribers(key)
            }
        )
    }
}
