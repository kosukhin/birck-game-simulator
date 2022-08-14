import { TKeyboardSubscriber } from "~~/src/Types/KeyboardTypes";

export class KeyboardService {
    private subscribers: TKeyboardSubscriber[] = [];

    constructor() {
        process.client && this.keyPressHandler();
    }

    /**
     * Зарегистрировать нового подписчика
     * @param subscriber
     */
    registerKeySubscriber(subscriber: TKeyboardSubscriber) {
        this.subscribers.push(subscriber);
    }

    /**
     * Очистить подписчиков
     */
    clearSubscribers() {
        this.subscribers = [];
    }

    /**
     * Глобальный хэндлер обработки нажатий клавиатуры
     */
    keyPressHandler() {
        window.addEventListener('keypress', (e) => {
            const {key} = e;
            this.runSubscribers(key);
        });
    }

    /**
     * Запускаем всех подписчиков
     * @param key
     */
    runSubscribers(key: string) {
        this.subscribers.forEach(subscriber => {
            subscriber.call(this, key);
        });
    }
}