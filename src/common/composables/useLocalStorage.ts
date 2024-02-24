import { errorNotClient } from '~/src/common/providers/errors'
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '~/src/common/utils/browser'
import { jsonParse } from '~/src/common/utils/json'
import {
  booleanToPromise,
  chainSilentThenable,
  resolve,
} from '~~/src/common/utils/fp'
import { ensureOnClientSide } from '~~/src/common/utils/predicates'

export const useLocalStorage = () => {
  return {
    get: getFn,
    set: setFn,
  }
}

const getFn = (key: string, defaultValue: any = null) =>
  resolve(key)
    .then(booleanToPromise(errorNotClient, ensureOnClientSide))
    .catch(chainSilentThenable)
    .then(getFromLocalStorage)
    .then(jsonParse(defaultValue))

const setFn = (v: string, key: string) =>
  resolve(v)
    .then(booleanToPromise(errorNotClient, ensureOnClientSide))
    .catch(chainSilentThenable)
    .then(saveToLocalStorage(key))
