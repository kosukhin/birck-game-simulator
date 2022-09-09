import { useService } from '~~/src/Common/Helpers/HService'
import { SBreadcrumbs } from '~~/src/Common/Services/SBreadcrumbs'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { SLanguage } from '~~/src/Common/Services/SLanguage'
import TanksGame from '~~/src/Tanks/Components/TanksGame/TanksGame.vue'

/**
 * Позволяет подключить игру Танки в проект
 */
export class STanks {
    afterInit(hooks: SHooks) {
        hooks.init.registerSubscriber(() => {
            const lang = useService<SLanguage>('lang')
            // Добавляем хлебные крошки для этой игры
            useService<SBreadcrumbs>('breadcrumbs').addBreadcrumbsConfig({
                'simulator-action': {
                    params: {
                        action: {
                            tanks: { text: lang.t('Tanks') },
                        },
                    },
                },
            })
        })
        hooks.gamesResolving.registerSubscriber((gamesList) => {
            gamesList.tanks = TanksGame
        })
    }
}
