export interface Config<TFields> {
  modify(fields: TFields): Config<TFields>
}

export abstract class BaseConfig<T> implements Config<T> {
  abstract newInstance(newFields: T): this

  constructor(readonly fields?: T) {}

  modify(fields: Partial<T>) {
    const newFields = Object.assign(this.fields ?? {}, fields) as T
    return this.newInstance(newFields)
  }
}
