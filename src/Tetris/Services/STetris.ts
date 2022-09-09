import { useService } from '~~/src/Common/Helpers/HService'
import { SBreadcrumbs } from '~~/src/Common/Services/SBreadcrumbs'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { SLanguage } from '~~/src/Common/Services/SLanguage'
import TetrisGame from '~~/src/Tetris/Components/TetrisGame/TetrisGame.vue'

/**
 * Позволяет подключить игру Тетрис в проект
 */
export class STetris {
    afterInit(hooks: SHooks) {
        hooks.init.registerSubscriber(() => {
            const lang = useService<SLanguage>('lang')
            // Добавляем хлебные крошки для игры тетрис
            useService<SBreadcrumbs>('breadcrumbs').addBreadcrumbsConfig({
                'simulator-action': {
                    params: {
                        action: {
                            tetris: { text: lang.t('Tetris') },
                        },
                    },
                },
            })
        })
        hooks.gamesResolving.registerSubscriber((gamesList) => {
            gamesList.tetris = TetrisGame
        })
    }
}
