import {Collapsed, requestJson, token} from "./apiReq.js";
import UUID from "./types/UUID.js";
import ChatUpdate from "./types/chat/ws/ChatUpdate.js";
import Subclass from "./types/Subclass.js";
import Listenable from "./Listenable.js";
import {primObj} from "./utils.js";
import {messageListener} from "./index.js";

let websocket:WebSocket;

type websocketMessage = {
    type:"ping"|"pong"|"connection_init"|"connection_ack"|"subscribe"|"next",
    payload?:ReturnType<typeof requestJson>|{Authorization:`Bearer ${string}`}
    id?:UUID
}
export function sendMessage(message:websocketMessage){
    websocket.send(JSON.stringify(message));
}

const listeners:{[k in websocketMessage['type']]?:Listenable<primObj>} = {};
export function listen(type:websocketMessage['type'], listener:(message:primObj)=>void){
    if(listeners[type] === undefined) listeners[type] = new Listenable();
    return listeners[type]!.listen(listener);
}
export function unlisten(type:websocketMessage['type'], listener:number){
    if(listeners[type]) listeners[type]?.unlisten(listener);
}

export function initWebsocket(){
    if(websocket!==undefined) return;

    websocket = new WebSocket("wss://api.barq.app/graphql","graphql-transport-ws");
    websocket.addEventListener('open', ()=>{
        websocket.addEventListener('message', (e:{data:string})=>{
            const data = JSON.parse(e.data) as {
                type:websocketMessage['type'],
                id?:UUID
                payload?:{
                    data:primObj
                    errors?:{}[]
                }
            };
            listeners[data.type]?.trigger(data.payload?.data ?? {});
        });

        const setup = listen('connection_ack', ()=>{
            listen("next", (message)=>{
                if(message.subscribeChatRooms!==undefined)
                    messageListener.trigger(message.subscribeChatRooms as unknown as Collapsed<ChatUpdate>);
            });

            sendMessage({
                'type':'subscribe',
                payload:requestJson<{subscribeChatRooms:ChatUpdate}>({
                    subscribeChatRooms:{
                        roomId:true,
                        profileId:true,
                        __typename:true,

                        ChatUpdateMessage:new Subclass({
                            message:{
                                id: true,
                                seqId: true,
                                createdAt: true,
                                updatedAt: true,
                                deletedAt: true,
                                profile: {
                                    id: true,
                                    username: true,
                                    relationType: true,
                                    isBirthday: true,
                                    primaryImage: {
                                        uuid: true,
                                        contentRating: true,
                                        blurHash:true,
                                        mimeType: true,
                                    }
                                },
                                payload: {
                                    type:true,
                                    ChatRoomMessagePayloadText: new Subclass({
                                        content:true,
                                    }),
                                    ChatRoomMessagePayloadSystem: new Subclass({
                                        action:true
                                    }),
                                },
                            }
                        }),
                        ChatUpdateProfileUpdateReadMarker:new Subclass({
                            seqId:true
                        })
                    }
                }, "subscription"),

                id:crypto.randomUUID(),
            });
            unlisten('connection_ack',setup);

            return false;
        })

        sendMessage({
            type:'connection_init',
            payload:{Authorization:`Bearer ${token.access_token}`},
        });

        const pinger = setInterval(()=>{
            sendMessage({type:'ping'});
        },1000*10);
        websocket.addEventListener('close', ()=>{
            console.log("closed websocket")
            clearInterval(pinger);
        });
    })
}