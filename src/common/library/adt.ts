type AnyFn = (...args: any[]) => any

export const pipe = (v: any, ...fns: any[]) =>
  fns.reduce((acc, fn) => {
    return fn(acc)
  }, v)

export const doMonad = (v: LazyMonad): LazyMonad => v.do()
export const map = (fn: AnyFn) => (context: LazyMonad) => context.lazyMap(fn)
export const chain = (fn: AnyFn) => (context: LazyMonad) =>
  context.lazyChain(fn)
export const tap = (fn: AnyFn) => (context: LazyMonad) => context.lazyTap(fn)

export const monad = (v: any) => new LazyMonad(v)
export class LazyMonad {
  protected executor: any = (v: any) => this.of(v)
  protected value: any

  get unSafeValue() {
    return this.value
  }

  set unSafeValue(value: any) {
    this.value = value
  }

  constructor(value: any) {
    this.value = value
  }

  do() {
    return this.executor(this.value)
  }

  of(value: any) {
    return new LazyMonad(value)
  }

  protected chain(fn: (value: any) => LazyMonad) {
    return fn(this.value)
  }

  lazyChain(fn: (value: any) => LazyMonad) {
    const lastExecutor = this.executor
    this.executor = (v: any) => {
      const monad = lastExecutor(v) as LazyMonad
      return monad.chain(fn)
    }
    return this
  }

  lazyMap(fn: (value: any) => any) {
    const lastExecutor = this.executor
    this.executor = (v: any) => {
      const monad = lastExecutor(v) as LazyMonad
      return monad.map(fn)
    }
    return this
  }

  protected map(fn: (value: any) => any) {
    this.value = fn(this.value)
    return this
  }

  // Выполняет колбэк в цепочке монады, но колбэк не влияет на цепочку монады
  lazyTap(fn: (value: any) => void) {
    const lastExecutor = this.executor
    this.executor = (v: any) => {
      const monad = lastExecutor(v) as LazyMonad
      fn(monad.unSafeValue)
      return monad
    }
    return this
  }

  getError(): string | null {
    return null
  }

  throwIfError() {
    if (this.getError()) {
      throw new Error(this.getError() ?? 'Unknown error')
    }
  }
}

export const none = () => new None(null)
export class None extends LazyMonad {
  of(value: any) {
    return new None(value)
  }

  protected chain(fn: (value: any) => LazyMonad) {
    if (this.value !== null && this.value !== undefined) {
      super.chain(fn)
    }
    return this
  }

  protected map(fn: (value: any) => any): this {
    if (this.value !== null && this.value !== undefined) {
      super.map(fn)
    }
    return this
  }
}

export const some = (v: any) => new Some(v)
export class Some extends LazyMonad {
  of(value: any) {
    return new Some(value)
  }
}

export const left = (error?: string) => new Left(error)
export class Left extends None {
  private error: string = 'Unknown error'

  getError() {
    return this.error
  }

  constructor(error?: string) {
    super(null)
    error && (this.error = error)
  }

  of(value: any) {
    return new Left(value)
  }
}

export const io = (v: (value: any) => Promise<any>) => new IO(v)
export class IO extends LazyMonad {
  private io: (value: any) => Promise<any>

  constructor(v: (value: any) => Promise<any>) {
    super(null)
    this.io = v
  }

  protected chain(fn: (value: any) => LazyMonad) {
    this.io(this.value).then((value) => {
      this.value = value
      super.chain(fn)
    })
    return this
  }

  protected map(fn: (value: any) => any) {
    this.io(this.value).then((value) => {
      this.value = value
      super.map(fn)
    })
    return this
  }

  of(value: any) {
    return new IO(value)
  }
}
