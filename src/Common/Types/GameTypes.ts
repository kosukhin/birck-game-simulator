export enum EKeyCode {
  W = 'KeyW',
  A = 'KeyA',
  S = 'KeyS',
  D = 'KeyD',
  Q = 'KeyQ',
  E = 'KeyE',
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

export const KeysToMoveMap: any = {
  [EKeyCode.W]: EMoveDirection.up,
  [EKeyCode.S]: EMoveDirection.down,
  [EKeyCode.A]: EMoveDirection.left,
  [EKeyCode.D]: EMoveDirection.right,
}

export const KeysToMoveCamera3: any = {
  [EMoveDirection.up]: {
    [EKeyCode.A]: EMoveDirection.left,
    [EKeyCode.D]: EMoveDirection.right,
  },
  [EMoveDirection.down]: {
    [EKeyCode.A]: EMoveDirection.right,
    [EKeyCode.D]: EMoveDirection.left,
  },
  [EMoveDirection.right]: {
    [EKeyCode.A]: EMoveDirection.up,
    [EKeyCode.D]: EMoveDirection.down,
  },
  [EMoveDirection.left]: {
    [EKeyCode.A]: EMoveDirection.down,
    [EKeyCode.D]: EMoveDirection.up,
  },
}
export const KeysToMoveCamera3Tanks: any = {
  [EMoveDirection.up]: {
    [EKeyCode.W]: EMoveDirection.up,
    [EKeyCode.A]: EMoveDirection.left,
    [EKeyCode.D]: EMoveDirection.right,
  },
  [EMoveDirection.down]: {
    [EKeyCode.W]: EMoveDirection.down,
    [EKeyCode.A]: EMoveDirection.right,
    [EKeyCode.D]: EMoveDirection.left,
  },
  [EMoveDirection.right]: {
    [EKeyCode.W]: EMoveDirection.right,
    [EKeyCode.A]: EMoveDirection.up,
    [EKeyCode.D]: EMoveDirection.down,
  },
  [EMoveDirection.left]: {
    [EKeyCode.W]: EMoveDirection.left,
    [EKeyCode.A]: EMoveDirection.down,
    [EKeyCode.D]: EMoveDirection.up,
  },
}

export interface IPoint {
  x?: number
  y?: number
}
