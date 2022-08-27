import { MSettings } from '~~/src/Models/MSettings'

/**
 * Сервис для хранения глобальных моделей. например
 * таких как Settings
 */
export class SModelsPool {
    /**
     * Настройки системы
     */
    public settings = new MSettings({ height: 15, width: 10 })
}
