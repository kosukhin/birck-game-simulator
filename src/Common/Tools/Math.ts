export function subtr(...args: number[]) {
  let result = args[0]
  for (let i = 1; i < args.length; i++) {
    result -= args[i]
  }
  return result
}

export function add(...args: number[]) {
  let result = args[0]
  for (let i = 1; i < args.length; i++) {
    result += args[i]
  }
  return result
}

export function mul(...args: number[]) {
  let result = args[0]
  for (let i = 1; i < args.length; i++) {
    result *= args[i]
  }
  return result
}

export const abs = Math.abs
