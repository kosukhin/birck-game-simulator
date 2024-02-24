import { ensureOnClientSidePromise } from '~/src/common/providers/errors'
import { triggerOnResize } from '~~/src/common/utils/browser'
import { chainSilentThenable, resolve } from '~~/src/common/utils/fp'

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
const calculateDevice = () =>
  resolve(device)
    .then(ensureOnClientSidePromise)
    .catch(chainSilentThenable)
    .then(triggerOnResize(calculateDevice))
    .then((v: Device) => {
      v.isMobile = window.innerWidth <= MOBILE_WIDTH_LIMIT
      return v
    })

calculateDevice()
