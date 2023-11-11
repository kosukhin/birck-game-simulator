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

  apply<T extends any>(model: BaseModel): Promise<T> | never {
    if (this.appliers[model.modelName()]) {
      return this.appliers[model.modelName()](model) as Promise<T>
    }

    throw new Error(
      `Model ${model.modelName()} is not configured for service! ${
        this.constructor.name
      }`
    )
  }
}
