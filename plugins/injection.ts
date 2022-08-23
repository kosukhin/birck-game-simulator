import { SLanguage } from "~~/src/Services/SLanguage";
import { SKeyboard } from "~~/src/Services/SKeyboard";
import { SLogger } from "~~/src/Services/SLogger";
import { SModelsPool } from "~~/src/Services/SModelsPool";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            services: {
                lang: new SLanguage(),
                keyboard: new SKeyboard(),
                logger: new SLogger(),
                modelsPool: new SModelsPool(),
            }
        }
    }
})
