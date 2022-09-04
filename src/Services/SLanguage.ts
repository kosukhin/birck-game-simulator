import Translations from '~~/src/Data/Translations'

/**
 * Сервис для работы с переводами
 */
export class SLanguage {
    /**
     * Переводит строку
     * @param key
     * @returns
     */
    t(key: string) {
        return Translations[key] ?? key
    }
}
