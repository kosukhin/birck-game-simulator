import { EKeyCode } from '~~/src/Common/Services/SKeyboard'

export type TGameRunner = () => void

/**
 * Направление движения
 */
export enum EMoveDirection {
    up,
    down,
    right,
    left,
}

/**
 * Карта противоположных направлений
 */
export const ReverseDirections = {
    [EMoveDirection.up]: EMoveDirection.down,
    [EMoveDirection.down]: EMoveDirection.up,
    [EMoveDirection.right]: EMoveDirection.left,
    [EMoveDirection.left]: EMoveDirection.right,
}

/**
 * Карта мапинга клавиш на направления движения
 */
export const КeysToMoveMap = {
    [EKeyCode.W]: EMoveDirection.up,
    [EKeyCode.S]: EMoveDirection.down,
    [EKeyCode.A]: EMoveDirection.left,
    [EKeyCode.D]: EMoveDirection.right,
}
