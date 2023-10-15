export interface Model<TFields> {
  modify(fields: TFields): Model<TFields>
}

export abstract class BaseModel<T> implements Model<T> {
  abstract newInstance(newFields: T): this

  constructor(readonly fields?: T) {}

  modify(fields: Partial<T>) {
    const newFields = Object.assign(this.fields ?? {}, fields) as T
    return this.newInstance(newFields)
  }
}
