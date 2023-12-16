import { create } from '~~/src/Common/Library/I'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

const renderService = create(RenderService)
const game = create(WfSnake, 15, 15)

export namespace snakeGameController {}
