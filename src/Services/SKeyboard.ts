import { TKeyboardSubscriber } from '~~/src/Types/KeyboardTypes'

/**
 * Сервис взаимодействия с клавиатурой
 */
export class SKeyboard {
    private subscribers: TKeyboardSubscriber[] = []

    constructor() {
        process.client && this.keyPressHandler()
    }

    /**
     * Регистрирует нового подписчика
     * @param subscriber
     */
    registerKeySubscriber(subscriber: TKeyboardSubscriber) {
        this.subscribers.push(subscriber)
    }

    /**
     * Очищает подписчиков на события клавиатуры
     */
    clearSubscribers() {
        this.subscribers = []
    }

    /**
     * Регистрирует глобальный хэндлер обработки нажатий клавиатуры
     */
    keyPressHandler() {
        window.addEventListener('keypress', (e) => {
            const { key } = e
            this.runSubscribers(key)
        })
    }

    /**
     * Запускает всех подписчиков
     * @param key
     */
    runSubscribers(key: string) {
        this.subscribers.forEach((subscriber) => {
            subscriber.call(this, key)
        })
    }
}
