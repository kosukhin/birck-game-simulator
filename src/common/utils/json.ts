import { curry } from 'lodash'

export const jsonParse = curry((defaultValue: any, v: string) => {
  return v ? JSON.parse(v) : defaultValue
})
