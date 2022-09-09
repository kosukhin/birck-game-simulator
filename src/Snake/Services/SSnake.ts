import { useService } from '~~/src/Common/Helpers/HService'
import { SBreadcrumbs } from '~~/src/Common/Services/SBreadcrumbs'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { SLanguage } from '~~/src/Common/Services/SLanguage'
import SnakeGame from '~~/src/Snake/Components/SnakeGame/SnakeGame.vue'

/**
 * Позволяет подключить игру Змейка в проект
 */
export class SSnake {
    afterInit(hooks: SHooks) {
        hooks.init.registerSubscriber(() => {
            const lang = useService<SLanguage>('lang')
            // Добавляем хлебные крошки для этой игры
            useService<SBreadcrumbs>('breadcrumbs').addBreadcrumbsConfig({
                'simulator-action': {
                    params: {
                        action: {
                            snake: { text: lang.t('Snake') },
                        },
                    },
                },
            })
        })
        hooks.gamesResolving.registerSubscriber((gamesList) => {
            gamesList.snake = SnakeGame
        })
    }
}
