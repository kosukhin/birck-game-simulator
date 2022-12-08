/**
 * Коды управляющих клавиш
 */
export enum EKeyCode {
    W = 'KeyW',
    A = 'KeyA',
    S = 'KeyS',
    D = 'KeyD',
    SPC = 'Space',
}

/**
 * Интерфейс игры
 */
export interface IGameWorkflow {
    run(): void
    /**
     * Приостанавливает игру или запускает снова после приостановки
     */
    pause(): void
}

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
export const KeysToMoveMap = {
    [EKeyCode.W]: EMoveDirection.up,
    [EKeyCode.S]: EMoveDirection.down,
    [EKeyCode.A]: EMoveDirection.left,
    [EKeyCode.D]: EMoveDirection.right,
}

export interface IPoint {
    x?: number
    y?: number
}
