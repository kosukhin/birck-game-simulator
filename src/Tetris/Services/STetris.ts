import { SHooks } from '~~/src/Common/Services/SHooks'
import TetrisGame from '~~/src/Tetris/Components/TetrisGame/TetrisGame.vue'

/**
 * Позволяет подключить игру Тетрис в проект
 */
export class STetris {
    afterInit(hooks: SHooks) {
        hooks.gamesResolving.registerSubscriber((gamesList) => {
            gamesList.tetris = TetrisGame
        })
    }
}
