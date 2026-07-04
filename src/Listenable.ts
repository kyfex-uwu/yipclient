import {pageLoadListener} from "./index.js";

export default class Listenable<T>{
    private readonly listeners:(((p:T)=>void)|undefined)[]=[];
    constructor() {}
    listen(listener:(p:T)=>void, disposeOnPageLoad:boolean=false){
        this.listeners.push(listener);
        const id=this.listeners.length-1;
        if(disposeOnPageLoad) {
            const plId = pageLoadListener.listen(()=>{
                this.unlisten(id);
                pageLoadListener.unlisten(plId);
            });
        }

        return id;
    }
    unlisten(listener:number){
        this.listeners[listener]=undefined;
    }
    trigger(v:T){
        for(const listener of this.listeners)
            if(listener) listener(v);
    }
}