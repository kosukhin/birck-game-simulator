import { CrBrowser } from '~~/src/Common/Connectors/CrBrowser'

/**
 * Содержит все конекторы приложения
 */
export class SConnectors {
    /** Конектор для взаимодействия с BrowserAPI */
    browser = new CrBrowser()
}
