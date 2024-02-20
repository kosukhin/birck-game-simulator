export class HService {
  static get<T>(name: string): T {
    return { name } as T
  }
}

export function useService<T>(name: string): T {
  return HService.get<T>(name)
}
