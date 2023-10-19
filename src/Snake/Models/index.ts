import { BaseModel } from '~/src/Common/Config/Model'

export class Point extends BaseModel {
  constructor(readonly x: number, readonly y: number) {
    super()
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
  constructor(readonly tail: Point[]) {
    super()
  }
}
