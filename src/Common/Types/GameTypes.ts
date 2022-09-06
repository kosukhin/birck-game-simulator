import { KeyCode } from '~~/src/Common/Services/SKeyboard'

export type TGameRunner = () => void

/**
 * Направление движения
 */
export enum MoveDirection {
    up,
    down,
    right,
    left,
}

/**
 * Карта противоположных направлений
 */
export const ReverseDirections = {
    [MoveDirection.up]: MoveDirection.down,
    [MoveDirection.down]: MoveDirection.up,
    [MoveDirection.right]: MoveDirection.left,
    [MoveDirection.left]: MoveDirection.right,
}

/**
 * Карта мапинга клавиш на направления движения
 */
export const КeysToMoveMap = {
    [KeyCode.W]: MoveDirection.up,
    [KeyCode.S]: MoveDirection.down,
    [KeyCode.A]: MoveDirection.left,
    [KeyCode.D]: MoveDirection.right,
}
