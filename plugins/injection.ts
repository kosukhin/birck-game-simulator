import {LanguageService} from "~~/src/Services/LanguageService";
import { KeyboardService } from "~~/src/Services/KeyboardService";
import { LoggerService } from "~~/src/Services/LoggerService";
import { ModelsPoolService } from "~~/src/Services/ModelsPoolService";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            services: {
                lang: new LanguageService(),
                keyboard: new KeyboardService(),
                logger: new LoggerService(),
                modelsPool: new ModelsPoolService(),
            }
        }
    }
})
