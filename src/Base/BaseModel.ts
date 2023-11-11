export type Constructable<T extends any> = { new (...args: any): T }

export abstract class BaseModel {
  abstract modelName(): string

  takeChanged(fields: Partial<this>): this {
    const newFields = Object.assign({ ...this }, fields)
    return new (this.constructor as Constructable<any>)(
      ...Object.values(newFields)
    )
  }
}
