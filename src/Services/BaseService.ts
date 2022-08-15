export class BaseService {
    private app;

    constructor() {
        this.app = useNuxtApp();
    }

    get $services() {
        return this.app.$services;
    }
}