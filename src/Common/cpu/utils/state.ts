import { Ref } from 'vue'
import { State } from '~~/src/Common/cpu/utils/system'

export const refState = <T>(ref: Ref<T>): State<T> => {
  return {
    get() {
      return ref.value
    },
    set(value) {
      ref.value = value
    },
  }
}
