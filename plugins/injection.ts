import {LanguageService} from "~/src/Services/Language/LanguageService";
import { GameService } from "~~/src/Services/Game/GameService";
import { GridService } from "~~/src/Services/Grid/GridService";
import { KeyboardService } from "~~/src/Services/Keyboard/KeyboardService";
import { LoggerService } from "~~/src/Services/Logger/LoggerService";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            services: {
                lang: new LanguageService(),
                grid: new GridService(),
                keyboard: new KeyboardService(),
                game: new GameService(),
                logger: new LoggerService(),
            }
        }
    }
})