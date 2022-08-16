export default new class ObjectHelper {
    clone(object: any) {
        return JSON.parse(JSON.stringify(object));
    }
}