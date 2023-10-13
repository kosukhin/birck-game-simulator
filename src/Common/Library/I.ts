export const I = {
  // Получение объекта из контейнера
  getInstance(constructorFunction: any, ...args: any[]) {
    // eslint-disable-next-line new-cap
    return new constructorFunction(...args)
  },
  // реакция на событие в виде колбэка
  reactOn(fn: Function, cb: Function) {
    return fn(cb)
  },
  // Применяю процедуру
  applyProcess(fn: Function, ...args: any[]) {
    return fn(...args)
  },
}
