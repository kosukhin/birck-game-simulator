import { ElNotification } from 'element-plus'
import { SHooks } from '~~/src/Common/Services/SHooks'
import { WebWorker } from '~~/src/Common/Library/WebWorker'

/**
 * Сервис рекламных банеров
 */
export class SAdvertisment {
    #advertisments = {
        tetris: {
            title: 'Тетрис',
            message: 'Дмитрий набрал 100 очков',
        },
        blasteroid: {
            title: 'Бластероид',
            message: 'Владимир заработал 40 очков',
        },
        snake: {
            title: 'Змейка',
            message: 'Евгений набрал 30 очков',
        },
        tanks: {
            title: 'Танки',
            message: 'Владислав уничтожил 50 танков',
        },
    }

    afterInit(hooks: SHooks) {
        hooks.init.registerSubscriber(() => {
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
                    ...this.#advertisments[data],
                    position: 'bottom-right',
                })
            })
        })
    }
}
