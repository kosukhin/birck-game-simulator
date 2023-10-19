export interface Model<TFields> {
  modify(fields: TFields): Model<TFields>
}

export abstract class BaseModel {
  returnChanged(fields: Partial<typeof this>) {
    const newFields = Object.assign({ ...this }, fields)
    newFields.returnChanged = this.returnChanged.bind(newFields)
    return newFields as this
  }
}
