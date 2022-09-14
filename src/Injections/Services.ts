import { SBlasteroid } from '~~/src/Blasteroid/Services/SBlasteroid'
import { SBreadcrumbs } from '~~/src/Common/Services/SBreadcrumbs'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { SCookies } from '~~/src/Common/Services/SCookies'
import { SDevice } from '~~/src/Common/Services/SDevice'
import { SDrawer } from '~~/src/Common/Services/SDrawer'
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
    breadcrumbs: new SBreadcrumbs(),
    keyboard: new SKeyboard(),
    logger: new SLogger(),
    connectors: new SConnectors(),
    drawer: new SDrawer(),
    cookies: new SCookies(),
    device: new SDevice(),

    // Игры
    snake: new SSnake(),
    tetris: new STetris(),
    tanks: new STanks(),
    blasteroid: new SBlasteroid(),
}

Object.values(services).forEach((service) => {
    if ('afterInit' in service) {
        // Это позволяет в сервисах подписаться на хуки системы
        ;(service as any).afterInit(hooks)
    }
})

export default services
