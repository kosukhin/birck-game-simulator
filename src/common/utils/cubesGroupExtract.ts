import { Mesh } from 'three'

type CubesMap = Record<string, Mesh>

export function cubesGroupExtract(cubesMap: CubesMap, group: string) {
  return Object.entries(cubesMap)
    .filter(([id]) => {
      return id.includes(group)
    })
    .map((entry) => entry[1])
}
