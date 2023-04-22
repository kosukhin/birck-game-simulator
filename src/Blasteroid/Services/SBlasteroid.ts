import { SHooks } from '~~/src/Common/Services/SHooks'
import BlasteroidGame from '~~/src/Blasteroid/Components/BlasteroidGame/BlasteroidGame.vue'

export class SBlasteroid {
  afterInit(hooks: SHooks) {
    hooks.gamesResolving.registerSubscriber((gamesList) => {
      gamesList.blasteroid = BlasteroidGame
    })
  }
}
