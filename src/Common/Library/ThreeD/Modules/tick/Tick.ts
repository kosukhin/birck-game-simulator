import { BaseModel } from '~/src/Base/BaseModel'

export class Tick extends BaseModel {
  constructor(readonly additional: number) {
    super()
  }

  internalName(): string {
    return 'KeyPress'
  }
}
