/**
 * Базовый класс наблюдаемого объекта, объект
 * который может уведомлять подписчиков о своем
 * изменении
 */
export class Observable<T> {
    private subscribers: T[] = []

    /**
     * Регистрирует нового подписчика
     * @param subscriber
     */
    registerSubscriber(subscriber: T) {
        this.subscribers.push(subscriber)
    }

    /**
     * Очищает подписчиков на события клавиатуры
     */
    clearSubscribers() {
        this.subscribers = []
    }

    /**
     * Запускает всех подписчиков
     * @param params
     */
    runSubscribers(params?: any) {
        this.subscribers.forEach((subscriber) => {
            ;(subscriber as any).call(this, params)
        })
    }
}
