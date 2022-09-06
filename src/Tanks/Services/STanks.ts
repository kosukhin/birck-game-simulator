import { SHooks } from '~~/src/Common/Services/SHooks'
import TanksGame from '~~/src/Tanks/Components/TanksGame/TanksGame.vue'

/**
 * Позволяет подключить игру Танки в проект
 */
export class STanks {
    afterInit(hooks: SHooks) {
        hooks.gamesResolving.registerSubscriber((gamesList) => {
            gamesList.tanks = TanksGame
        })
    }
}
