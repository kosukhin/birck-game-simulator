import { chain, pipe, map, some } from '~~/src/common/library/adt'
import { triggerOnResize } from '~~/src/common/utils/browser'
import { booleanToMonad } from '~~/src/common/utils/fp'
import { ensureOnClientSide } from '~~/src/common/utils/predicates'

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
pipe(
  some(device),
  chain(booleanToMonad(ensureOnClientSide)),
  triggerOnResize,
  map((v: Device) => {
    v.isMobile = window.innerWidth <= MOBILE_WIDTH_LIMIT
    return v
  })
).do()
