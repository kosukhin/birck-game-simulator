import { baseSize } from '~~/src/Common/Constants/Three'
import { mul } from '~~/src/Common/Tools/Math'

export const toBaseSize = mul.bind(null, baseSize)
