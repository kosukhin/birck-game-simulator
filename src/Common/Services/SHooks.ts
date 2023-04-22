import { Observable } from '~~/src/Common/Library/Observable'

export class SHooks {
  init = new Observable<() => void>()
  gamesResolving = new Observable<(gamesList: any) => void>()
}
