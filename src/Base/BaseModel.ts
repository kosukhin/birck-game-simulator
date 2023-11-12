export type Constructable<T extends any> = { new (...args: any): T }

export abstract class BaseModel {
  abstract internalName(): string
}
