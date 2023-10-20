export interface Model<TFields> {
  modify(fields: TFields): Model<TFields>
}

export abstract class BaseModel {
  takeChanged(fields: Partial<typeof this>) {
    const newFields = Object.assign({ ...this }, fields)
    newFields.takeChanged = this.takeChanged.bind(newFields)
    return newFields as this
  }
}
