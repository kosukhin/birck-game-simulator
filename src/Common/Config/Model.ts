export interface Model<TFields> {
  modify(fields: TFields): Model<TFields>
}

export abstract class BaseModel {
  modify(fields: Partial<typeof this>) {
    const newFields = Object.assign({ ...this }, fields)
    newFields.modify = this.modify.bind(newFields)
    return newFields as this
  }
}
