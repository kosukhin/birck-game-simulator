import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { SLanguage } from '~~/src/Common/Services/SLanguage'
import { SLogger } from '~~/src/Common/Services/SLogger'
import { SSnake } from '~~/src/Snake/Services/SSnake'
import { STanks } from '~~/src/Tanks/Services/STanks'
import { STetris } from '~~/src/Tetris/Services/STetris'

const hooks = new SHooks()
const services = {
    hooks,
    lang: new SLanguage(),
    keyboard: new SKeyboard(),
    logger: new SLogger(),
    connectors: new SConnectors(),
    snake: new SSnake(),
    tetris: new STetris(),
    tanks: new STanks(),
}

// Если у сервиса есть метод afterInit вызываем этот метод
Object.values(services).forEach((service) => {
    if ('afterInit' in service) {
        ;(service as any).afterInit(hooks)
    }
})

export default services
