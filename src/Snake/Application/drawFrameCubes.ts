import { Cube, Point } from '~/src/Snake/Models'
import { takeInstance } from '~/src/Common/Library/I'

export function drawFrameCubes(target: Point, lead: Point, tail: Point[]) {
  const tailCubes = tail.map((point, index) => {
    return takeInstance(Cube, `tail_${index}`, 0xeeeeee, point.x, point.y)
  })
  return {
    target: takeInstance(Cube, 'target', 0x00aa00, target.x, target.y),
    lead: takeInstance(Cube, 'lead', 0xaa0000, lead.x, lead.y),
    tail: tailCubes,
  }
}
