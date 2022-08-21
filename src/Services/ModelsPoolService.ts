import {Settings} from '~~/src/Models/Settings';

/**
 * Сервис для хранения глобальных моделей. например
 * таких как Settings
 */
export class ModelsPoolService {
    /**
     * Настройки системы
     */
    public settings = new Settings({height: 15, width: 10});
}
