import Cookies from 'js-cookie'

export class SCookies {
    set(key: string, value: string) {
        Cookies.set(key, value, { expires: 365 })
    }

    get(key: string) {
        return Cookies ? Cookies.get(key) : null
    }

    remove(key: string) {
        Cookies.remove(key)
    }
}
