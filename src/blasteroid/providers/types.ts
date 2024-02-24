import { Shape } from '~/src/common/types/Block'
import { Game } from '~/src/common/types/Game'

export type BlasteroidGame = Game & {
  blasteroid: Shape | null
  enemy: Shape | null
}
