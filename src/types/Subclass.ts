import {RequestFields} from "../apiReq.js";

export default class Subclass<T>{
    public readonly value: RequestFields<T>;
    constructor(value:RequestFields<T>) {
        this.value=value;
    }
}