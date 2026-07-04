import {html} from "@arrow-js/core";
import {Collapsed, Func, request, VMarker} from "../apiReq.js";
import ChatRoomMessage from "../types/chat/ChatRoomMessage.js";
import Subclass from "../types/Subclass.js";
import {computed, ref} from "arrowjs-aluminum";
import {addCss, mainRouter, messageListener, self} from "../index.js";
import {getImage, sanitize, style} from "../utils.js";
import ChatRoom from "../types/chat/ChatRoom.js";
import ChatRoomParticipant from "../types/chat/ChatRoomParticipant.js";
import icon from "../icon.js";

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
    const messages=ref<Collapsed<ChatRoomMessage>[]|undefined>(undefined);
    const roomData = ref<Collapsed<ChatRoom>|undefined>(undefined);
    const otherUser = computed<Collapsed<ChatRoomParticipant>|undefined>(()=>
        roomData.value?.participants.find(p=>p.profile.uuid != self.value?.profile.uuid));

    request(new Func<ChatRoomMessage>("chatRoomMessages", {
        limit: new VMarker('limit', 'Int', undefined),
        roomId: new VMarker('roomId', 'Int!', parseInt(vars.chatId)),
        cursor: new VMarker('cursor', 'Int', undefined),
    }, {
        "seqId": true,
        profile:{
            id:true,
        },
        "createdAt": true,
        "updatedAt": true,
        "deletedAt": true,
        "payload": {
            type:true,
            ChatRoomMessagePayloadText: new Subclass({
                content:true,
            }),
            ChatRoomMessagePayloadSystem: new Subclass({
                action:true
            }),
        },
    })).then(v=> {
        messages.value = v;

        messageListener.listen((update)=>{
            switch(update.__typename){
                case 'ChatUpdateMessage':
                    if(update.roomId === roomData.value?.id)
                        messages.value = [update.message, ...messages.value ?? []];
                    break;
            }
        }, true)
    });
    request(new Func<ChatRoom>('chatRoom',{
        roomId:new VMarker('roomId','Int!',parseInt(vars.chatId))
    },{
        image:{
            uuid: true,
            contentRating: true,
            blurHash: true,
            mimeType: true,
        },
        isArchived: true,
        isRemoved: true,
        lastReadSeqId: true,
        lastSeqId: true,
        participants: {
            profile:{
                uuid: true,
                displayName: true,
                username: true,
                primaryImage: {
                    uuid: true,
                    contentRating: true,
                    blurHash: true,
                    mimeType: true,
                }
            }
        },
        status: true,
        title: true,
        type: true,
        id: true,
        lastMessage: {
            payload:{
                type:true,

                ChatRoomMessagePayloadText: new Subclass({
                    content: true
                }),
                ChatRoomMessagePayloadSystem: new Subclass({
                    action: true
                })
            }
        },
        lastMessageAt: true,
    })).then(v=>roomData.value=v[0]);

    function sendMessage(textarea:HTMLTextAreaElement, event:Event){
        request(new Func<ChatRoomMessage>('chatRoomMessageSend', {
            //roomId: $roomId, message: $message
            roomId:new VMarker('roomId', 'Int!', parseInt(vars.chatId)),
            message: new VMarker('message', 'ChatRoomMessageInput!', {
                content:textarea.value
            })
        }, {
            seqId:true,
            // createdAt
            // updatedAt
            // deletedAt
            profile: {
                id:true
            },
            payload: {
                type:true,
                ChatRoomMessagePayloadText: new Subclass({
                    content:true,
                }),
                ChatRoomMessagePayloadSystem: new Subclass({
                    action:true
                }),
            }
        }, false), {type:"mutation"})

        textarea.value="";
        event.preventDefault();
    }

    return html`<div class="chatroom-header" @click="${()=>{
        if(roomData.value!==undefined)
            mainRouter.redirect(`/fuzzbutt/${otherUser.value?.profile.uuid}`);
    }}">${()=>roomData.value===undefined?'':html`
        <div>${getImage(otherUser.value?.profile.primaryImage, {canExpand:false})}</div>
        <div><div>${roomData.value?.title}</div></div>
    `}
    </div>
    <div class="chatroom-holder">
        ${()=>messages.value===undefined?'':html`
            ${()=>messages.value?.map(message=>html`
                <div class="${`message-holder ${message.profile.id == self.value?.profile.id ? 'you' : ''}`}"><div class="message">
                    ${sanitize(message.payload.type==="text" ? message.payload.content : message.payload.action)}
                </div></div>
            `)}
        `}
    </div>
    <div class="chatroom-input">
        <textarea @keypress="${(e:KeyboardEvent)=> {
            if(e.code === "Enter" && !e.shiftKey) sendMessage(e.target!, e)
        }}" enterkeyhint="send"></textarea>
        <span @click="${(e:PointerEvent)=> {
            let el = e.target!;
            while(el.nodeName !== "DIV")
                el = el.parentElement;
            sendMessage(el.children[0], e)
        }}">${icon("send")}</span>
    </div>
    `;
}