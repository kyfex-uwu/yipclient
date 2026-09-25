import {PageAttachedRouter, ref} from "arrowjs-aluminum";
import {html} from "@arrow-js/core";
import search from "./pages/search.js";
import profile from "./pages/profile.js";
import {tiks} from "@rexa-developer/tiks";
import {getImage, imageModal, style} from "./utils.js";
import login from "./pages/login.js";
import chat from "./pages/chat.js";
import {initWebsocket} from "./websocket.js";
import chatroom from "./pages/chatroom.js";
import Listenable from "./Listenable.js";
import icon from "./icon.js";
import {getCurrentUser, GetCurrentUser200} from "./api.js";

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

addCss(`
@import url('https://fonts.googleapis.com/css2?family=Glory:ital,wght@0,100..800;1,100..800&display=swap');

body{
    background:black;
}

#root{
    position:relative;
    font-family: "Chiron GoRound TC", sans-serif;
    background:var(--black);
    color:var(--white);
    height:100vh;
    display:flex;
    flex-direction:column;
    
    font-size:4vw;
    
    --black:#2b2523;
    --white:#e9ded0;
    --primary:#ff4000;
    --secondary:#ff8f00;
    
    * {
        scrollbar-color:color-mix(var(--white), var(--black) 20%) var(--black);
        box-sizing:border-box;
        font-family: inherit;
    }
    
    /**/
    
    & .header-bar{
        font-size:2em;
        --border-bottom: solid var(--white) 0.2em;
        z-index: 1;
        position: relative;
        padding:0.2em;
        background-color:color-mix(var(--white), transparent 80%);
        
        & a{
            text-decoration: none;
            border-radius: 0.8em;
            color:var(--white);
            padding: 0.1em 0.4em;
            
            transition:background-color 0.2s;
            
            &:hover{
                background-color:color-mix(var(--white), transparent 80%);
            }
        }
        
        & div:has(.img){
            display: flex;
            float:right;
            cursor:pointer;
            
            height: 1.19em;
            border-radius:0.7em;
            overflow:clip;
            aspect-ratio:1/1;
            margin-right:0.1em;
            
            & .img img{
                width:100%;
                height:100%;
                object-fit:cover;
                object-position:center center;
            }
            
            transition: scale 0.2s;
            &:hover{
                scale: 1.2;
            }
        }
        & .icon{
            background-color:var(--white);
        }
    }
    & .page{
        flex:1;
        overflow:scroll;
    }
    & .footer-bar{
        font-size:2em;
        background-color:color-mix(var(--white), var(--black) 80%);
        padding:0.2em 0.5em;
        display:flex;
        
        & > *{
            flex:1;
            text-align:center;
            border-radius:1em;
            margin: 0 0.1em;
            
            transition:background-color 0.2s;
            &:hover{
                background-color:color-mix(var(--white), transparent 80%);
            }
        }
        
        & .icon{
            background-color:var(--white);
        }
    }
}

a{
    color: #84a9ff;
    
    &:visited{
        color: #d384ff;
    }
}

/**/

.like-icon{
    aspect-ratio: 1/1;
    height: 1.3em;
    background-color: var(--color);
    border-radius: 50%;
    display:inline-block;
    box-shadow: 0 0 0.1em var(--color);
    text-align:center;
    
    --color:#000;
    
    &.friend{
        --color:#84d865;
    }
    &.liked{
        --color:#ff628e;
    }
    &.likedBy{
        --color:#ffb2dd;
    }
    &.mutual{
        --color:#ffb78c;
    }
    
    & .icon{
        height:100%;
        scale:0.9;
        mix-blend-mode:multiply;
        background:#888;
    }
}

`);

tiks.init({
    theme: 'crisp',
    volume: 0.3,
});

export const messageListener = new Listenable<any>();//TODO
export const self = ref<GetCurrentUser200|undefined>(undefined);
export const notifications = ref<undefined>(undefined);
export const token = ref<string|null>(window.localStorage.getItem("token"));

const initing = new Promise<void>(async (r,reject)=>{
    // if(token.access_token === undefined) await refreshToken();

    await getCurrentUser().then(v => self.value = v.data)
        .catch(reject);
    initWebsocket();

    // request({
    //     notifications:{
    //         __typename:true
    //     }
    // }).then(r=>{
    //     console.log("ae",r)
    // })

    r();
})

export const pageLoadListener = new Listenable<void>();
let mainRouter:PageAttachedRouter;
mainRouter = new PageAttachedRouter(document.getElementById("root")!,
    ()=>html`404`,
    async (template, vars, state)=>{
        pageLoadListener.trigger();
        if(state.noauth !== true) {
            await initing.catch(e=>setTimeout(()=>mainRouter.redirect("/login"),0))
        }

        return html`<div class="header-bar">
            ${mainRouter.link('/settings')`${icon("settings")}`}
            <span style="${style({float:"right"})}">${mainRouter.link('/notifications')`${icon("notification")}`}</span>
        </div><div class="page">${template}</div><div class="footer-bar">
            ${mainRouter.link('/yap')`${icon("send")}`}${
            mainRouter.link('/')`${icon("search")}`}
        </div>${imageModal}
        
        <div style="${
            style({display:"none", position:"fixed",bottom:"0", width:"100%","background-color":"red",padding:"0.5em",color:"white"})}">YipClient is in alpha! report bugs 
            <span>${
            mainRouter.link("https://github.com/kyfex-uwu/yipclient/issues")`here`
        }</span></div>`;
})
.addRoute("", search)
.addRoute("fuzzbutt/:userId", profile)
.addRoute("yap", chat)
.addRoute("yap/:chatId", chatroom)

.addRoute("login", login)

export {mainRouter};
mainRouter.redirect();
