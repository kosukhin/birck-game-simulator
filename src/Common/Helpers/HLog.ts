import { HService } from '~~/src/Common/Helpers/HService'
import { SLogger } from '~~/src/Common/Services/SLogger'

export class HLog {
    static log(tag: string, ...messages: any[]) {
        HService.get<SLogger>('logger').log(tag, ...messages)
    }
}

export function useLog(tag): (...messages: any[]) => void {
    return (...messages: any[]) => {
        HLog.log(tag, ...messages)
    }
}
