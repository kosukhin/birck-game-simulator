import { Observable } from '~~/src/Common/Library/Observable'

/**
 * Позволяет добавить код внутрь вебворкера, чтобы запустить
 * параллельный поток кода
 */
export class WebWorker {
    #objectUrl: string
    #worker: Worker
    onmessage = new Observable<(event) => void>()
    onerror = new Observable<(event) => void>()

    /**
     * @param work Функция которая будет работать внутри воркера
     */
    constructor(work) {
        this.createWorker(work)
    }

    /**
     * Создает воркер, идея из репозитория
     * https://github.com/israelss/simple-web-worker/
     * @param response
     * @returns
     */
    createWorker(work) {
        const URL = window.URL || window.webkitURL
        const blob = new Blob([`(${work})()`], { type: 'application/javascript' }) // eslint-disable-line
        this.#objectUrl = URL.createObjectURL(blob)
        this.#worker = new Worker(this.#objectUrl) // eslint-disable-line

        this.#worker.onmessage = (event) => {
            this.onmessage.runSubscribers(event)
        }

        this.#worker.onerror = (event) => {
            this.onerror.runSubscribers(event)
        }
    }

    /**
     * Отправить сообщение воркеру
     * @param data
     */
    postMessage(data) {
        this.#worker.postMessage(data)
    }

    /**
     * Очищаем данные воркера
     */
    terminate() {
        URL.revokeObjectURL(this.#objectUrl)
        this.#worker.terminate()
    }
}
