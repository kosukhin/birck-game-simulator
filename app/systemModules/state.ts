import { Ref } from 'nuxt/dist/app/compat/capi'

export interface StateValue<T> {
  target(): any
  get<R = T>(): R
  set(newValue: T): void
}

export function state<T = undefined>(value?: any): StateValue<T> {
  const innerValue = ref(value)
  return {
    target(): Ref<typeof value> {
      return innerValue
    },
    get<R = typeof value>(): R {
      return innerValue.value
    },
    set(newValue) {
      innerValue.value = newValue
    },
  }
}
