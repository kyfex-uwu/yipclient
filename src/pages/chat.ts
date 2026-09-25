import {html} from "@arrow-js/core";
import {ref} from "arrowjs-aluminum";
import {addCss, mainRouter, self} from "../index.js";
import {getImage, sanitize} from "../utils.js";
import {listChatRooms, ListChatRooms200EdgesItem} from "../api.js";

addCss(`
.chat-holder{
    & .room {    
        margin: 0.3em;
        padding: 0.3em 1em 0.3em 0.3em;
        border-radius: 1em;
        display:flex;
        cursor:pointer;
        background-color:color-mix(in srgb, var(--white), transparent 80%);
        
        transition:scale 0.2s;
        &:hover{
            scale:1.01;
        }
        
        & div:has(.img){
            display: flex;
            
            height:3em;
            border-radius:0.7em;
            overflow:clip;
            aspect-ratio:1/1;
            margin-right:0.5em;
            
            & .img img{
                width:100%;
                height:100%;
                object-fit:cover;
                object-position:center center;
            }
        }
        
        & .text {
            flex:1 1 0;
            overflow:hidden;
            
            & div{
                white-space: nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
        }
    }
}
`);

export default (vars:{[k:string]:string})=>{
    const chatRooms = ref<ListChatRooms200EdgesItem[]|undefined>(undefined);

    listChatRooms({}).then(v=>chatRooms.value=v.data.edges);

    return html`<div class="chat-holder">
        ${()=>chatRooms.value?.map(v=>html`
        <div class="room" @click="${()=>{
            mainRouter.redirect(`/yap/${v.node.id}`)
        }}">
            <div>${getImage(v.node.participants.find(p=>p.profile?.uuid !== undefined &&
                    p.profile.uuid !== self.value?.profile.uuid)?.profile?.primaryImage, {canExpand:false})}</div>
            <div class="text">
                <div>${sanitize(v.node.title)}</div>
                <div>${sanitize(v.node.lastMessage?.payload?.content ?? '')}</div>
            </div>
        </div>`)}
    </div>`
}