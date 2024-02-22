import { curry } from 'lodash'
import { none, some } from '~~/src/common/library/adt'

export const booleanToMonad = curry((boolPredicate: Function, v: any) => {
  return boolPredicate() ? some(v) : none()
})
