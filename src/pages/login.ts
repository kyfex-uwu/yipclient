import {html} from "@arrow-js/core";
import {style} from "../utils.js";
import {ref} from "arrowjs-aluminum";
import {setToken} from "../apiReq.js";
import {addCss, mainRouter, self} from "../index.js";

addCss(`
.login-box{
    width: min(70%, 70vh);
    aspect-ratio: 1/1;
    position: absolute;
    left: 15%;
    top:50%;
    transform:translateY(-50%);

    box-shadow: 0 0 1em color-mix(var(--white), transparent), 0 0 2em color-mix(var(--black), transparent) inset;
    border-radius: 0.5em;
    background:var(--white);
    color:var(--black);
    padding:0.5em;
    text-align:center;
    font-size:2em;

    display:flex;
    flex-direction:column;
    
    & input{
        font-size:0.5em;
    }
    & button{
        font-size:0.5em;
        border: none;
        background-color: var(--primary);
        color: var(--white);
        font-weight: bold;
        border-radius: 1em;
        width: fit-content;
        padding: 0.4em 1em;
        text-shadow:0 0 0.2em color-mix(var(--black), transparent 80%);
        pointer:cursor;
        
        transition:scale 0.2s;
        &:hover{
            scale:1.05;
        }
    }
}
`)

export default (v:{[k:string]:string}, s:{[k:string]:any})=>{
    s.noauth=true;

    let email="";
    let code="";
    const enteringCode = ref(false);

    return html`
        ${()=>{
            if(self.value!==undefined) mainRouter.redirect("/");
        }}
        
        <div class="login-box">
            <div style="flex:1">
                <img style="height:20vw" src="/assets/logo.png">
            </div>
            <input enterkeyhint="next" @input="${(e:InputEvent)=>email=(e.target! as HTMLInputElement).value}" 
                    disabled="${()=>enteringCode.value}"
                    placeholder="fox@email.com">
            <input @input="${(e:InputEvent)=>code=(e.target! as HTMLInputElement).value}" 
                    disabled="${()=>!enteringCode.value}"
                   style="${style({"text-transform": "uppercase full-width", "text-align":"center"})}"
                    placeholder="#######">
            <div style="${style({"text-align":"center"})}">
            ${()=>!enteringCode.value ? html`
                <button @click="${()=>{
                    fetch("https://api.barq.app/account-provider/email/request-code", {
                        method:"POST",
                        body:JSON.stringify({email}),
                        headers:{
                            'content-type':'application/json'
                        }
                    }).then(()=>enteringCode.value=true)
                }}">send code</button>` : html`
                <button @click="${()=>{
                    fetch("https://api.barq.app/account-provider/email/login", {
                        method:"POST",
                        body:JSON.stringify({email, code:code.toLowerCase()}),
                        headers:{
                            'content-type':'application/json'
                        }
                    }).then(r=>r.json()).then(r=> {
                        setToken(r, Infinity);
                        window.location="/";
                    })
                }}">login</button>
                
            `}
            </div>
            <div style="flex:1"></div>
        </div>
    `;
}