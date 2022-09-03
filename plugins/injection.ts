import { SLanguage } from '~~/src/Services/SLanguage'
import { SKeyboard } from '~~/src/Services/SKeyboard'
import { SLogger } from '~~/src/Services/SLogger'
import { SModelsPool } from '~~/src/Services/SModelsPool'
import { SConnectors } from '~~/src/Services/SConnectors'
import { SHooks } from '~~/src/Services/SHooks'

export default defineNuxtPlugin(() => {
    const hooks = new SHooks()
    const injection = {
        provide: {
            services: {
                hooks,
                lang: new SLanguage(),
                keyboard: new SKeyboard(),
                logger: new SLogger(),
                modelsPool: new SModelsPool(),
                connectors: new SConnectors(),
            },
        },
    }

    // Если у сервиса есть метод afterInit вызываем этот метод
    Object.values(injection.provide.services).forEach((service) => {
        if ('afterInit' in service) {
            ;(service as any).afterInit(hooks)
        }
    })

    return injection
})
