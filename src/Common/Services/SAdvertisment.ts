import { ElNotification } from 'element-plus'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { WebWorker } from '~~/src/Common/Library/WebWorker'
import { useService } from '~~/src/Common/Helpers/HService'
import { SLanguage } from '~~/src/Common/Services/SLanguage'

interface IAdvertisment {
  title: string
  message: string
}

export class SAdvertisment {
  private advertisments!: Record<string, IAdvertisment>

  afterInit(hooks: SHooks) {
    hooks.init.registerSubscriber(() => {
      const lang = useService<SLanguage>('lang')
      this.advertisments = {
        tetris: {
          title: lang.t('Tetris'),
          message: lang.t('Dmitry scored 100 points'),
        },
        blasteroid: {
          title: lang.t('Blasteroid'),
          message: lang.t('Vladimir earned 40 points'),
        },
        snake: {
          title: lang.t('Snake'),
          message: lang.t('Evgeny scored 30 points'),
        },
        tanks: {
          title: lang.t('Tanks'),
          message: lang.t('Vladislav destroyed 50 tanks'),
        },
      }

      const worker = new WebWorker(() => {
        const games = ['tanks', 'tetris', 'snake', 'blasteroid']

        setInterval(() => {
          if (!games.length) {
            close()
            return
          }

          const index = Math.floor(Math.random() * games.length)
          postMessage(games[index])
          games.splice(index, 1)
        }, 10000)
      })

      worker.onmessage.registerSubscriber((event) => {
        const { data } = event

        ElNotification({
          ...this.advertisments[data],
          position: 'bottom-right',
        })
      })
    })
  }
}
