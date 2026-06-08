import {PageAttachedRouter, ref, Ref} from "arrowjs-aluminum";
import {html, type ArrowTemplate} from "@arrow-js/core";

//--

export function setTitle(newTitle:string){
    document.title="YipClient | "+newTitle;
}

export function addCss(css:string){
    document.getElementById("css")!.textContent+="\n"+css;
}

//--

//monkeypatch
//any node that calls addEventListener with name "load" will have that listener called immediately with the
//dom element as the only argument.
//this means having @load on any arrowjs constructor will load that immediately with the element
const oldAEL = Node.prototype.addEventListener;
Node.prototype.addEventListener = function (type, listener:EventListenerOrEventListenerObject, ...params) {
    if (type === "loadel" && listener instanceof Function) listener(
        //@ts-expect-error
        this as Event);
    else return oldAEL.apply(this, [type, listener, ...params]);
}

//--

addCss(``);

const mainRouter = new PageAttachedRouter(document.getElementById("root")!,
    ()=>html`404`,
    (template, vars, state)=>{
        return html`${template}`;
})
    .addRoute("", ()=>html`
        ${()=>setTitle("Search")}
    `)

mainRouter.redirect();
