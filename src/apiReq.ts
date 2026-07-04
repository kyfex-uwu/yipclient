import Subclass from "./types/Subclass.js";
import {primitive} from "./utils.js";

export const token = JSON.parse(window.localStorage.getItem('Authorization') ?? '{}') as {
    access_token?:string,
    expires_at?:EpochTimeStamp,
};
export function setToken(t:string, expires:number){
    token.access_token = t;
    token.expires_at = expires;

    window.localStorage.setItem('Authorization', JSON.stringify({
        access_token:t,
        expires_at: expires
    }));

    setTimeout(()=>{
        refreshToken();
    },expires-1000*30)
}
let alreadyRefreshed=false;
export async function refreshToken(){
    if(alreadyRefreshed) return;
    alreadyRefreshed=true;

    await fetch("https://id.barq.app/token", {
        method:"POST",
        headers:{
            'content-type':'application/x-www-form-urlencoded'
        },
        body:JSON.stringify({}),
    }).then(r=>r.json()).then(v=>{
        //setToken(v.access_token, v.expires_in);
    });
}

//--

export class VMarker{
    public readonly name:string;
    public readonly type:string;
    public readonly value:string;
    constructor(name:string, type:string, value:any){
        this.name=name;
        this.type=type;
        this.value=value;
    }
}

export class Func<T>{
    public readonly fields: RequestFields<T>;
    public readonly args: { [p: string]: any };
    public readonly name: string;
    constructor(name:string, args:{[k:string]:any},fields:RequestFields<T>, isArray:boolean=true) {
        this.name=name;
        this.args=args;
        this.fields=fields;
    }
}

type RFT<T> = T extends Subclass<infer R> ? R : T;
export type RequestFields<T> = {[key in keyof RFT<T>]?:
    RFT<T>[key] extends primitive|primitive[] ? boolean|VMarker :
    (RFT<T>[key] extends Array<any> ? RequestFields<RFT<T>[key][0]> :
    (RFT<T>[key] extends Subclass<infer R> ? Subclass<R> :
    RequestFields<RFT<T>[key]>))};

//all keys in an object where the value is a subclass : that subclass's fields
type SubclassKeys<T> = { [key in keyof T] : T[key] extends Subclass<any> ? [keyof T[key]["value"], T[key]["value"]] : never }
//fromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T; };
export type Collapsed<T> =
    {[key in keyof {[k in keyof T]: T[k] extends Subclass<any> ? never : true}]: Collapsed<T[key]>} &
    {[key in (SubclassKeys<T> extends {[k:string]:infer R extends [string, infer V]} ? R[0] : never)]: any}//V[R[0]]

//--

function stringifyRequestFields(request:RequestFields<any>, varHolder:{[k:string]:VMarker}){
    return Object.entries(request).map(([k,v]):string|undefined=>{
        if(!v) return;
        if(v !== true && Object.keys(v).length===0) return;

        if(v === true || v instanceof VMarker) return k;

        if(v instanceof Subclass)
            return `... on ${k} {${stringifyRequestFields(v.value, varHolder)}}`;

        const vars = Object.entries(v)
            .map(([k,v])=>v instanceof VMarker ? [k,v] satisfies [string,VMarker] : undefined)
            .filter(v=>v!==undefined);
        for(const v of vars) varHolder[v[1].name]=v[1];

        return `${k}${vars.length===0?"":`(${vars.map(([k,v])=>`${k}:$${v.name}`).join(", ")})`
            }{${stringifyRequestFields(v,varHolder)}}`;
    }).filter(v=>v!==undefined).join(" ");
}

export function requestJson<T>(request:RequestFields<T>|Func<T>, type:"query"|"subscription"|"mutation"="query"){
    const varHolder:{[k:string]:VMarker} = {};
    const str = stringifyRequestFields(request instanceof Func ? request.fields : request, varHolder);
    if(request instanceof Func){
        for(const v in request.args)
            if(request.args[v] instanceof VMarker)
                varHolder[v]=request.args[v];
    }
    const vars = Object.entries(varHolder);

    return {
        "operationName":"YipQuery",
        "variables":Object.fromEntries(vars.map(([k,v])=>[k,v.value])),
        "query":`${type} YipQuery${vars.length===0?"":`(${vars.map(([_,v])=>`$${v.name}:${v.type}`)})`
        } {${request instanceof Func ?
            `${request.name}(${Object.entries(request.args).map(([k,v])=>
                `${k}:${v instanceof VMarker ? `$${v.name}` : v}`).join(" ")}){${str}}`:
            str}}`
    };
}

export function request<T>(request:Func<T>, data?:{type?: "query" | "subscription" | "mutation", cacheTime?:number}):Promise<Collapsed<T>[]>;
export function request<T>(request:RequestFields<T>, data?:{type?: "query" | "subscription" | "mutation", cacheTime?:number}):Promise<Collapsed<T>>;
export function request<T>(request:RequestFields<T>|Func<T>, data:{type?: "query" | "subscription" | "mutation", cacheTime?:number}={}):Promise<Collapsed<T>>|Promise<Collapsed<T>[]>{
    return fetch('https://api.barq.app/graphql', {
        method:"POST",
        body:JSON.stringify(requestJson(request, data.type ?? "query")),
        headers:{
            Authorization:`Bearer ${token.access_token}`,
            'Content-Type':"application/json"
        }
    }).then(r=>r.json()).then(j=>j.data).then(toReturn=>
        request instanceof Func ?
            (toReturn[request.name] instanceof Array ? toReturn[request.name] : [toReturn[request.name]]) :
            toReturn);
}