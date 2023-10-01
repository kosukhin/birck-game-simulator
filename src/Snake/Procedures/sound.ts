import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { threeAudioPlay } from '~~/src/Common/Tools/Three'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export function useSoundBindProcedure(rserv: RenderService, game: WfSnake) {
  const eatSound = () => rserv.sound('eated', '/sounds/eated.wav')
  game.addEvent('afterEated', async () => {
    const sound = await eatSound()
    threeAudioPlay(sound)
  })

  const explodeSound = () => rserv.sound('explode', '/sounds/explode.wav')
  game.addEvent('gameover', async () => {
    const sound = await explodeSound()
    threeAudioPlay(sound)
  })

  onMounted(() => {
    Promise.all([eatSound(), explodeSound()])
  })
}
