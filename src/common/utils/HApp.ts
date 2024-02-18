import debounce from 'lodash.debounce'

export class HApp {
  static #uniqCounter = 99

  static wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }

  static debounce(callback: () => void, speed: number) {
    return debounce(callback, speed)
  }

  static uniqueId(prefix?: string) {
    HApp.#uniqCounter++
    return 'app_' + (prefix ? prefix + HApp.#uniqCounter : HApp.#uniqCounter)
  }
}
