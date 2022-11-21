import { storeToRefs } from 'pinia'
import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import Translations from '~~/src/Common/Data/Translations'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { useApplicationStore } from '~~/stores/application'
import { useService } from '~~/src/Common/Helpers/HService'
import { SCookies } from '~~/src/Common/Services/SCookies'

/**
 * Сервис для работы с переводами
 */
export class SLanguage {
    /** Текущий язык */
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
            })
        })
    }

    /**
     * Устанавливает значение языка
     * @param lang
     */
    setLangValue(lang: string) {
        if (!this.#lang) {
            this.#lang = ref(lang)
        }

        this.#lang.value = lang
    }

    /**
     * Переводит строку
     * @param key
     * @returns
     */
    t(key: string) {
        if (!this.#lang) {
            return key
        }

        if (!Translations.has(this.#lang.value)) {
            return key
        }

        if (!Translations.get(this.#lang.value).has(key)) {
            return key
        }

        return Translations.get(this.#lang.value).get(key)
    }
}
