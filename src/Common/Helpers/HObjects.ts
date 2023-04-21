import merge from 'lodash.merge'
import { HLog } from '~~/src/Common/Helpers/HLog'

export class HObjects {
    static clone(object: any): any {
        let result = {}

        try {
            result = JSON.parse(JSON.stringify(object))
        } catch (e) {
            HLog.log('helpers', 'clone error', e)
        }

        return result
    }

    static merge(object1, object2) {
        const result = {}
        merge(result, object1, object2)

        return result
    }
}
