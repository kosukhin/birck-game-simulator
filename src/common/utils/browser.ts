import { curry, debounce } from 'lodash'
import { LazyMonad } from '~~/src/common/library/adt'

export const triggerOnResize = (context: LazyMonad) => {
  context.lazyMap((v) => {
    window.addEventListener(
      'resize',
      debounce(() => {
        context.do()
      }, 100)
    )
    return v
  })
  return context
}

export const saveToLocalStorage = curry((key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value))
  return value
})

export const getFromLocalStorage = (key: string) => {
  return window.localStorage.getItem(key)
}
