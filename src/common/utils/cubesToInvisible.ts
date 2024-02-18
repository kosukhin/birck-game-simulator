import { Mesh } from 'three'
import set from 'lodash/set'

export const cubesToInvisible = (cube: Mesh) => set(cube, 'visible', false)
