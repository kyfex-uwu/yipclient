import Subclass from "../Subclass.js";

type ChatRoomMessagePayload = {
    "type": "text"|"system",

    ChatRoomMessagePayloadText:Subclass<{
        content:string
    }>,
    ChatRoomMessagePayloadSystem:Subclass<{
        action:string
    }>,

    "__typename": "ChatRoomMessagePayload"|"ChatRoomMessagePayloadText"|"ChatRoomMessagePayloadSystem",
}
export default ChatRoomMessagePayload;