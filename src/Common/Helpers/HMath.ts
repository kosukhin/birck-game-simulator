export class HMath {
    static random(min: number, max: number) {
        const value = Math.round(Math.random() * max)

        return value < min ? min : value
    }

    static round(num: number): number {
        return Math.round(num)
    }

    static roundMin(num: number): number {
        return Math.floor(num)
    }

    static abs(num: number) {
        return Math.abs(num)
    }
}
