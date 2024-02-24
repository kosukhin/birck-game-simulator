import { ensureOnClientSidePromise } from '~/src/common/providers/errors'
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '~/src/common/utils/browser'
import { jsonParse } from '~/src/common/utils/json'
import { skipNextThens, resolve } from '~~/src/common/utils/fp'

export const useLocalStorage = () => {
  return {
    get: getFn,
    set: setFn,
  }
}

const getFn = (key: string, defaultValue: any = null) =>
  resolve(key)
    .then(ensureOnClientSidePromise)
    .catch(skipNextThens)
    .then(getFromLocalStorage)
    .then(jsonParse(defaultValue))

const setFn = (v: string, key: string) =>
  resolve(v)
    .then(ensureOnClientSidePromise)
    .catch(skipNextThens)
    .then(saveToLocalStorage(key))
