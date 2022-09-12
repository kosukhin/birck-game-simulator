import { useService } from '~~/src/Common/Helpers/HService'
import { Observable } from '~~/src/Common/Library/Observable'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { TKeyboardSubscriber } from '~~/src/Common/Types/KeyboardTypes'

/**
 * Коды управляющих клавиш
 */
export enum EKeyCode {
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
                e.preventDefault()
                const key = e.code
                this.runSubscribers(key)
            }
        )
    }

    /**
     * Симулирует нажатия клавиши
     * @param keyCode
     */
    triggerKeyPress(keyCode: string) {
        window.dispatchEvent(
            new KeyboardEvent('keypress', {
                altKey: false,
                bubbles: true,
                cancelable: true,
                charCode: 0,
                code: keyCode,
                composed: true,
                ctrlKey: false,
                detail: 0,
                isComposing: false,
                key: keyCode,
                location: 0,
                metaKey: false,
                repeat: false,
                shiftKey: false,
            })
        )
    }
}
