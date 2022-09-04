import { SConnectors } from '~~/src/Services/SConnectors'
import { SHooks } from '~~/src/Services/SHooks'
import { SKeyboard } from '~~/src/Services/SKeyboard'
import { SLanguage } from '~~/src/Services/SLanguage'
import { SLogger } from '~~/src/Services/SLogger'
import { SModelsPool } from '~~/src/Services/SModelsPool'

const hooks = new SHooks()
const services = {
    hooks,
    lang: new SLanguage(),
    keyboard: new SKeyboard(),
    logger: new SLogger(),
    modelsPool: new SModelsPool(),
    connectors: new SConnectors(),
}

// Если у сервиса есть метод afterInit вызываем этот метод
Object.values(services).forEach((service) => {
    if ('afterInit' in service) {
        ;(service as any).afterInit(hooks)
    }
})

export default services
