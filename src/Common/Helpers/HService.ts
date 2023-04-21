import services from '~~/src/Injections/Services'

export class HService {
    static get<T>(name: string): T {
        return services[name]
    }
}

export function useService<T>(name: string): T {
    return HService.get<T>(name)
}
