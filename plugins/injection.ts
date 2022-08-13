import {LanguageService} from "~/src/Services/Language/LanguageService";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            services: {
                lang: new LanguageService(),
            }
        }
    }
})