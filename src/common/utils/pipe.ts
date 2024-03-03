export const pipe = (...fns: any[]) => {
  return (v: any) =>
    fns.reduce((acc, fn) => {
      return fn(acc)
    }, v)
}

export const pipePromise = (...fns: Function[]) => {
  return <T extends any>(v: T) =>
    fns.reduce(
      (acc, fn) =>
        acc
          .then((v: any) => {
            const fnResult = fn(v)
            return isThenable(fnResult) ? fnResult : Promise.resolve(fnResult)
          })
          .catch(emptyPromise),
      Promise.resolve(v)
    )
}

const emptyPromise = (err: unknown) => ({
  then(_: unknown, onReject: Function) {
    onReject(err)
    return emptyPromise
  },
})

const isThenable = (v: unknown) =>
  typeof v === 'object' && v !== null && 'then' in v
