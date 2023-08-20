export enum EKeyCode {
  W = 'KeyW',
  A = 'KeyA',
  S = 'KeyS',
  D = 'KeyD',
  SPC = 'Space',
}

export interface IGameWorkflow {
  run(): void

  pause(): void
}

export enum EMoveDirection {
  up,
  down,
  right,
  left,
}

export const ReverseDirections = {
  [EMoveDirection.up]: EMoveDirection.down,
  [EMoveDirection.down]: EMoveDirection.up,
  [EMoveDirection.right]: EMoveDirection.left,
  [EMoveDirection.left]: EMoveDirection.right,
}

export const KeysToMoveMap: Record<EKeyCode, EMoveDirection> = {
  [EKeyCode.W]: EMoveDirection.up,
  [EKeyCode.S]: EMoveDirection.down,
  [EKeyCode.A]: EMoveDirection.left,
  [EKeyCode.D]: EMoveDirection.right,
}

export interface IPoint {
  x?: number
  y?: number
}
