export class HLog {
  static log(tag: string, ...messages: any[]) {
    console.log(tag, ...messages)
  }
}

export function useLog(tag: string): (...messages: any[]) => void {
  return (...messages: any[]) => {
    HLog.log(tag, ...messages)
  }
}
