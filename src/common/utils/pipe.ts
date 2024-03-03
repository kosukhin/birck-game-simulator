export const pipe = (...fns: Function[]) =>
  fns.reduce(
    (acc, fn) =>
      acc
        .then((v: any) => {
          const fnResult = fn(v)
          return isThenable(fnResult) ? fnResult : Promise.resolve(fnResult)
        })
        .catch(emptyPromise),
    Promise.resolve(null)
  )

export const pass = (v: any) => () => v

const emptyPromise = (err: unknown) => ({
  then(_: unknown, onReject: Function) {
    onReject(err)
    return emptyPromise
  },
})

const isThenable = (v: unknown) =>
  typeof v === 'object' && v !== null && 'then' in v
