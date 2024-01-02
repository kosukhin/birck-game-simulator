export class State {
  constructor(public value: any) {}
}

export interface StateValue<T> {
  get(): T
  set(newValue: T): void
}

export const state: <T = undefined>(
  ...props: ConstructorParameters<typeof State>
) => StateValue<T> = (value) => {
  const innerValue = ref(value)
  return {
    get() {
      return innerValue.value
    },
    set(newValue) {
      innerValue.value = newValue
    },
  }
}
