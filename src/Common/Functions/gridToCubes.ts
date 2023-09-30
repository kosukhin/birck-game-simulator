import { TGrid } from '~/src/Common/Types/GridTypes'

type CubeDto = {
  isFilled: boolean
  id: string
}

export function gridToCubesDto(grid: TGrid, idPrefix: string) {
  const dtos: CubeDto[] = []
  grid.forEach((row, rowIndex) => {
    row.forEach((isFilled, cellIndex) => {
      const id = `target_${cellIndex}_${rowIndex}`
      dtos.push({
        isFilled,
        id,
      })
    })
  })

  return dtos
}
