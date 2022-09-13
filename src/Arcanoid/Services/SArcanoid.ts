import { SHooks } from '~~/src/Common/Services/SHooks'
import ArcanoidGame from '~~/src/Arcanoid/Components/ArcanoidGame/ArcanoidGame.vue'

/**
 * Сервис игры Арканоид
 */
export class SArcanoid {
    afterInit(hooks: SHooks) {
        hooks.gamesResolving.registerSubscriber((gamesList) => {
            gamesList.arcanoid = ArcanoidGame
        })
    }
}
