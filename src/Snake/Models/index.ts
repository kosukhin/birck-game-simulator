import { BaseModel } from '~/src/Common/Config/Model'

export class Point extends BaseModel {
  constructor(readonly x: number, readonly y: number) {
    super()
  }
}

export class PointWithColor extends Point {
  constructor(readonly color: number, ...rest: [number, number]) {
    super(...rest)
  }
}

export class PointWithId extends Point {
  constructor(readonly id: string, ...rest: [number, number]) {
    super(...rest)
  }
}

export class Cube extends BaseModel {
  constructor(
    readonly id: string,
    readonly color: string | number,
    readonly x: number,
    readonly y: number
  ) {
    super()
  }
}

export class SnakeTail extends BaseModel {
  constructor(readonly points: PointWithId[]) {
    super()
  }
}

export class SnakeGame extends BaseModel {
  constructor(
    readonly target: Point,
    readonly lead: Point,
    readonly tail: SnakeTail
  ) {
    super()
  }
}
