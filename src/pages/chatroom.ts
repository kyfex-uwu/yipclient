import {html} from "@arrow-js/core";
import ChatRoomMessage from "../types/chat/ChatRoomMessage.js";
import Subclass from "../types/Subclass.js";
import {computed, ref} from "arrowjs-aluminum";
import {addCss, mainRouter, messageListener, self} from "../index.js";
import {getImage, sanitize, style} from "../utils.js";
import ChatRoom from "../types/chat/ChatRoom.js";
import ChatRoomParticipant from "../types/chat/ChatRoomParticipant.js";
import icon from "../icon.js";
import {
    ChatParticipantDto,
    ChatRoomDto,
    getChatRoom,
    listChatRoomMessages,
    ListChatRoomMessages200EdgesItem, sendChatRoomMessage
} from "../api.js";

addCss(`
#root:has(.chatroom-holder){
    max-height:100vh;
    display:flex;
    flex-direction:column;
}

.chatroom-header{
    padding:1em;
    display:flex;
    cursor:pointer;
    
    & .img{
        height:3em;
        border-radius:0.7em;
        overflow:clip;
        aspect-ratio:1/1;
        margin-right:0.5em;
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
}

.chatroom-holder{
    display: flex;
    flex-direction: column-reverse;
    overflow:scroll;
    padding:1em;
    flex-grow:1;

    & .message-holder{
        margin: 0.1em;
        
        --border-top:1em;
        --border-bottom:1em;
        
        & .message{
            padding: 0.4em 0.6em;
            border: solid var(--white) 1px;
            border-radius: var(--border-top) 1em 1em var(--border-bottom);
            max-width: 60%;
            width:fit-content;
            
        }
        &.you .message{
            float:right;
            border-radius: 1em var(--border-top) var(--border-bottom) 1em;
            background-color:var(--primary);
            color:var(--black);
            border: solid transparent 1px;
        }
    }
    
    & .message-holder.you + .message-holder.you,
    & .message-holder:not(.you) + .message-holder:not(.you){
        --border-bottom:0.2em;
    }
    & .message-holder.you:has(+ .message-holder.you),
    & .message-holder:not(.you):has(+ .message-holder:not(.you)) {
        --border-top:0.2em;
    }
    & .message-holder.you + .message-holder:not(.you),
    & .message-holder:not(.you) + .message-holder.you{
        margin-bottom:1em;
    }

}
.chatroom-input{
    margin: 0 1em 1em 1em;
    background: color-mix(var(--white), transparent 80%);
    border-radius: 0.3em 0.3em 0.8em 0.8em;
    display:flex;
    
    & textarea{
        background-color:transparent;
        width:100%;
        padding:0.3em;
        resize: none;
        border: none;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        field-sizing: content;
    }
    & > span{
        height:2em;
        aspect-ratio:1/1;
        margin:0.5em;
        background-color:var(--primary);
        border-radius:100%;
        text-align:center;
        line-height:0;
        cursor:pointer;
        
        transition:scale 0.2s;
        
        &:hover{
            scale:1.1;
        }
        
        & > .icon{
            position:relative;
            top:50%;
            transform:translateY(-50%);
            height:70%;
            background-color:var(--white);
        }
    }
}
`)

export default (vars:{[k:string]:string})=> {
    const messages=ref<ListChatRoomMessages200EdgesItem[]|undefined>(undefined);
    const roomData = ref<ChatRoomDto|undefined>(undefined);
    const otherUser = computed<ChatParticipantDto|undefined>(()=>
        roomData.value?.participants.find(p=>p.profile?.uuid!==undefined && p.profile.uuid !== self.value?.profile.uuid));

    listChatRoomMessages(parseInt(vars.chatId),{
        // cursor:0,
        pageSize: 30
    }).then(v=> {
        messages.value = v.data.edges;

        messageListener.listen((update)=>{
            switch(update.__typename){
                case 'ChatUpdateMessage':
                    if(update.roomId === roomData.value?.id)
                        messages.value = [update.message, ...messages.value ?? []];
                    break;
            }
        }, true)
    });
    getChatRoom(parseInt(vars.chatId)).then(v=>roomData.value=v.data);

    function sendMessage(textarea:HTMLTextAreaElement, event:Event){
        sendChatRoomMessage(parseInt(vars.chatId),{
            content:textarea.value,
            //TODO:replies??
        });

        textarea.value="";
        event.preventDefault();
    }

    return html`<div class="chatroom-header" @click="${()=>{
        if(otherUser.value?.profile?.uuid!==undefined)
            mainRouter.redirect(`/fuzzbutt/${otherUser.value?.profile?.uuid}`);
    }}">${()=>roomData.value===undefined?'':html`
        <div>${getImage(otherUser.value?.profile?.primaryImage, {canExpand:false})}</div>
        <div><div>${roomData.value?.title}</div></div>
    `}
    </div>
    <div class="chatroom-holder">
        ${()=>messages.value===undefined?'':html`
            ${()=>messages.value?.map(message=>html`
                <div class="${`message-holder ${message.node.profile?.id == self.value?.profile.id ? 'you' : ''}`}"><div class="message">
                    ${sanitize((message.node.payload?.type==="text" ? message.node.payload.content : message.node.payload?.action) ?? "",{newlineToBr:true})}
                </div></div>
            `)}
        `}
    </div>
    <div class="chatroom-input">
        ${/*
             @keypress="${(e:KeyboardEvent)=> {
                if(e.code === "Enter" && !e.shiftKey) sendMessage(e.target!, e)
            }}" enterkeyhint="send"
        */""}
        <textarea></textarea>
        <span @click="${(e:PointerEvent)=> {
            let el = e.target!;
            while(el.nodeName !== "DIV")
                el = el.parentElement;
            sendMessage(el.children[0], e)
        }}">${icon("send")}</span>
    </div>
    `;
}