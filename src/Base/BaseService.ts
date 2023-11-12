import { BaseRepository } from './BaseRepository'
import { BaseModel } from './BaseModel'

export abstract class BaseService {
  repositories: BaseRepository[] = []
  appliers: Record<string, Function> = {}
  isSetup = false

  setup() {
    if (!this.isSetup) {
      console.log('setup service ', this.constructor.name)
      this.repositories.forEach((repository) => {
        repository.install(this)
      })
      this.isSetup = true
    }

    return this
  }

  apply<T extends any>(model: BaseModel, ...args: any[]): Promise<T> | never {
    if (this.appliers[model.internalName()]) {
      return this.appliers[model.internalName()](model, ...args) as Promise<T>
    }

    throw new Error(
      `Model ${model.internalName()} is not configured for service! ${
        this.constructor.name
      }`
    )
  }
}
