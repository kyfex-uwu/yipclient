import {html} from "@arrow-js/core";
import {Collapsed, Func, request, VMarker} from "../apiReq.js";
import ChatRoom from "../types/chat/ChatRoom.js";
import Subclass from "../types/Subclass.js";
import {ref} from "arrowjs-aluminum";
import {addCss, mainRouter, self} from "../index.js";
import {getImage, sanitize} from "../utils.js";

addCss(`
.chat-holder{
    & .room {    
        margin: 0.3em;
        border: solid var(--white) 1px;
        padding: 0.3em 1em 0.3em 0.3em;
        border-radius: 1em;
        display:flex;
        cursor:pointer;
        
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
    const chatRooms = ref<Collapsed<ChatRoom>[]>([]);

    request(new Func<ChatRoom>('chatRooms', {
        limit: new VMarker('limit', 'Int', undefined),
        offset: new VMarker('offset', 'Int', undefined),
        status: new VMarker('status', 'ChatRoomJoinStatus', undefined),
    }, {
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
    })).then(v=>chatRooms.value=v);

    return html`<div class="chat-holder">
        ${()=>chatRooms.value.map(v=>html`
        <div class="room" @click="${()=>{
            mainRouter.redirect(`/yap/${v.id}`)
        }}">
            <div>${getImage(v.participants.find(p=>p.profile.uuid != self.value?.profile.uuid)?.profile.primaryImage, {canExpand:false})}</div>
            <div class="text">
                <div>${sanitize(v.title)}</div>
                <div>${sanitize(v.lastMessage?.payload.content ?? '')}</div>
            </div>
        </div>`)}
    </div>`
}