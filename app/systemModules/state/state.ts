import { Ref } from 'nuxt/dist/app/compat/capi'

export class State {
  constructor(public value?: any) {}
}

export interface StateValue<T> {
  target(): any
  get<R = T>(): R
  set(newValue: T): void
}

export const state: <T = undefined>(
  ...props: ConstructorParameters<typeof State>
) => StateValue<T> = (value) => {
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
