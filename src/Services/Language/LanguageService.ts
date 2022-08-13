import Translations from "~/src/Data/Translations";

export class LanguageService {
    t(key: string) {
        return Translations[key] ?? key;
    }
}