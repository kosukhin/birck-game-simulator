import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { HObjects } from '~~/src/Common/Helpers/HObjects'
import { useService } from '~~/src/Common/Helpers/HService'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { SLanguage } from '~~/src/Common/Services/SLanguage'

interface IBreadcrumbLink {
    text: string
    link?: string
}

/**
 * Сервис работы формирования хлебных крошек
 */
export class SBreadcrumbs {
    /** Счетчик для обновления компонента хлебных крошек */
    #breadcrumbsRenderCounter: Ref<number>
    /** Конфигурация хлебных крошек, ее можно расширить методом addBreadcrumbsConfig */
    #breadcrumbs: any = {}

    constructor() {
        this.#breadcrumbsRenderCounter = ref(1)
    }

    afterInit(hooks: SHooks) {
        hooks.init.registerSubscriber(() => {
            const app = useNuxtApp()
            const lang = useService<SLanguage>('lang')
            this.#breadcrumbs = {
                index: {
                    text: lang.t('Home'),
                    link: '/',
                },
                simulator: {
                    parent: 'index',
                    text: lang.t('Simulator'),
                    link: '/simulator/',
                },
                'simulator-action': {
                    parent: 'simulator',
                    params: {
                        action: {
                            snake: { text: lang.t('Snake') },
                            tanks: { text: lang.t('Tanks') },
                            tetris: { text: lang.t('Tetris') },
                            blasteroid: { text: lang.t('Blasteroid') },
                        },
                    },
                },
                'new-game': {
                    parent: 'index',
                    text: lang.t('Create new game'),
                },
                documentation: {
                    parent: 'index',
                    text: lang.t('Documentation'),
                },
                about: {
                    parent: 'index',
                    text: lang.t('About project'),
                },
            }

            app.$router.beforeEach(() => {
                this.#breadcrumbsRenderCounter.value++
            })
        })
    }

    /**
     * Добавить конфиг в основной конфиг хлебных крошек
     * @param config
     */
    addBreadcrumbsConfig(config) {
        this.#breadcrumbs = HObjects.merge(this.#breadcrumbs, config)
    }

    /**
     * Позволяет перерисовать компонент Breadcrumbs
     */
    get renderCounter() {
        return this.#breadcrumbsRenderCounter
    }

    /**
     * Возвращает массив хлебных крошек для текущего роута
     * @returns
     */
    getLinks(): IBreadcrumbLink[] {
        const route = useNuxtApp().$router.currentRoute.value
        const links = this.buildBreadcrumb(route.name, route.params)

        return links
    }

    /**
     * Строит хлебные крошки рекурсивно на основании данных в объекте #breadcrumbs
     * @param name
     * @param params
     * @returns
     */
    buildBreadcrumb(name: string, params?: any): IBreadcrumbLink[] {
        let result = []

        if (this.#breadcrumbs[name]) {
            if (params && this.#breadcrumbs[name].params) {
                Object.entries(params).forEach((entry: [string, string]) => {
                    const [paramKey, paramValue] = entry

                    if (
                        this.#breadcrumbs[name].params[paramKey] &&
                        this.#breadcrumbs[name].params[paramKey][paramValue]
                    ) {
                        result.push({
                            text: this.#breadcrumbs[name].params[paramKey][
                                paramValue
                            ].text,
                            link: this.#breadcrumbs[name].params[paramKey][
                                paramValue
                            ].link,
                        })
                    }
                })
            } else {
                result.push({
                    text: this.#breadcrumbs[name].text,
                    link: this.#breadcrumbs[name].link,
                })
            }

            if (this.#breadcrumbs[name].parent) {
                result = [
                    ...this.buildBreadcrumb(this.#breadcrumbs[name].parent),
                    ...result,
                ]
            }
        }

        return result
    }
}
