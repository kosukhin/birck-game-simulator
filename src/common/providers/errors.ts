import { booleanToPromise } from '~/src/common/utils/fp'
import { ensureOnClientSide } from '~/src/common/utils/predicates'

export const errorNotClient = 'Не на стороне клиента!'
export const ensureOnClientSidePromise = booleanToPromise(
  errorNotClient,
  ensureOnClientSide
)
