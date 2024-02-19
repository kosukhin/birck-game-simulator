import { Observable } from '~~/src/common/library/Observable'

export class WebWorker {
  onmessage = new Observable<(event) => void>()
  onerror = new Observable<(event) => void>()
  #objectUrl: string
  #worker: Worker

  constructor(work) {
    this.createWorker(work)
  }

  createWorker(work) {
    const URL = window.URL || window.webkitURL
    const blob = new Blob([`(${work})()`], {type: 'application/javascript'}) // eslint-disable-line
    this.#objectUrl = URL.createObjectURL(blob)
    this.#worker = new Worker(this.#objectUrl) // eslint-disable-line

    this.#worker.onmessage = (event) => {
      this.onmessage.runSubscribers(event)
    }

    this.#worker.onerror = (event) => {
      this.onerror.runSubscribers(event)
    }
  }

  postMessage(data) {
    this.#worker.postMessage(data)
  }

  terminate() {
    URL.revokeObjectURL(this.#objectUrl)
    this.#worker.terminate()
  }
}
