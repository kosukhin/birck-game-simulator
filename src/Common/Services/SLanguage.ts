import { storeToRefs } from 'pinia'
import { Ref } from 'nuxt/dist/app/compat/capi'
import Translations from '~~/src/Common/Data/Translations'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { useApplicationStore } from '~~/stores/application'
import { useService } from '~~/src/Common/Helpers/HService'
import { SCookies } from '~~/src/Common/Services/SCookies'

/**
 * Сервис для работы с переводами
 */
export class SLanguage {
    #lang: Ref<string>

    afterInit(hooks: SHooks) {
        hooks.init.registerSubscriber(() => {
            const cookieService = useService<SCookies>('cookies')
            const appStore = useApplicationStore()
            const { lang } = storeToRefs(appStore)
            const cookieLang = cookieService.get('lang')
            this.#lang = lang

            if (cookieLang) {
                appStore.setLang(cookieLang)
            }

            // Вотчим изменение языка в сторе, и записываем куки
            watch(lang, () => {
                cookieService.set('lang', lang.value)
                location.reload()
            })
        })
    }

    /**
     * Переводит строку
     * @param key
     * @returns
     */
    t(key: string) {
        return Translations?.[this.#lang.value]?.[key] ?? key
    }
}
