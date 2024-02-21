import { curry, debounce } from 'lodash'
import {
  chain,
  pipe,
  map,
  some,
  LazyMonad,
  none,
} from '~~/src/common/library/adt'

type Device = {
  isMobile: boolean
}

const device = reactive<Device>({
  isMobile: false,
})

export const useDevice = () => {
  return device
}

const MOBILE_WIDTH_LIMIT = 1024
const updateDeviceState = (v: Device) => {
  v.isMobile = window.innerWidth <= MOBILE_WIDTH_LIMIT
  return v
}

const triggerOnResize = (context: LazyMonad) => {
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

const ensureOnClientSide = () => !!window === true

const booleanToMonad = curry((boolPredicate: Function, v: any) => {
  return boolPredicate() ? some(v) : none()
})

pipe(
  some(device),
  chain(booleanToMonad(ensureOnClientSide)),
  triggerOnResize,
  map(updateDeviceState)
).do()
