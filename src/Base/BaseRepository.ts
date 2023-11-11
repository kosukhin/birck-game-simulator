import { BaseService } from './BaseService'

export type Applier = [model: string, applier: Function]

export abstract class BaseRepository {
  abstract registerApplier(): Applier

  install(service: BaseService) {
    const [modelName, applier] = this.registerApplier()
    service.appliers[modelName] = applier
  }
}
