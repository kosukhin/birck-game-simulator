export function thenIf(condition: boolean, then: Function) {
  if (condition) {
    then()
  }
}

export function passNotNullishValue(value: any, defaultValue: any) {
  return value ?? defaultValue
}

export function iterate(
  cb: (i: number) => 'continue' | 'break' | void,
  to: number,
  from = 0,
  incrementBy = 1
) {
  for (let i = from; i < to; i += incrementBy) {
    const action = cb(i)

    if (action === 'break') {
      break
    }

    if (action === 'continue') {
      continue
    }
  }
}
