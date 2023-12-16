import { defineModelFactory } from '~~/src/Common/Library/I'

export type PointWithColorModel = {
  color: number
  x: number
  y: number
}

export const pointWithColorModel = defineModelFactory<PointWithColorModel>()({})

export type PointModel = {
  x: number
  y: number
}

export const pointModel = defineModelFactory<PointModel>()({})
