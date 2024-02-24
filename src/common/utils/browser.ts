import { curry, debounce } from 'lodash'

export const triggerOnResize = curry((fn: Function, context: any) => {
  window.addEventListener(
    'resize',
    debounce(() => {
      fn()
    }, 100)
  )
  return context
})

export const saveToLocalStorage = curry((key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value))
  return value
})

export const getFromLocalStorage = (key: string) => {
  return window.localStorage.getItem(key)
}
