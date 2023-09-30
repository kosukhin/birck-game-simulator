export function thenIf(condition: boolean, then: Function) {
  if (condition) {
    then()
  }
}

export function passNotNullishValue(value: any, defaultValue: any) {
  return value ?? defaultValue
}
