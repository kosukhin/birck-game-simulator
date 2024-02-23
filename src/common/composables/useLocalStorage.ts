import { booleanToMonad } from '~~/src/common/utils/fp'
import { ensureOnClientSide } from '~~/src/common/utils/predicates'
import { chain, map, pipe, some } from '~/src/common/library/adt'
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '~/src/common/utils/browser'

export const useLocalStorage = () => {
  return {
    get: (key: string, defaultValue: any = null) => {
      return pipe(
        some(key),
        chain(booleanToMonad(ensureOnClientSide)),
        map(getFromLocalStorage),
        map((v: string) => {
          return v ? JSON.parse(v) : defaultValue
        })
      ).do()
    },
    set: (v: string, key: string) =>
      pipe(
        some(v),
        chain(booleanToMonad(ensureOnClientSide)),
        map(saveToLocalStorage(key))
      ).do(),
  }
}
