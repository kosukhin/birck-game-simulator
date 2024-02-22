import { debounce } from 'lodash'
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
