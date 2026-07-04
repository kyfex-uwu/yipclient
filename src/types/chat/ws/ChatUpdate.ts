import Subclass from "../../Subclass.js";
import ChatRoomMessage from "../ChatRoomMessage.js";

type ChatUpdate = {
    roomId:number
    profileId:string
    date:string

    ChatUpdateMessage:Subclass<{
        message:ChatRoomMessage
    }>
    ChatUpdateProfileUpdateReadMarker:Subclass<{
        seqId:number
    }>

    __typename:"ChatUpdate"|"ChatUpdateMessage"|"ChatUpdateProfileStartTyping"|"ChatUpdateProfileStopTyping"|"ChatUpdateProfileUpdateReadMarker"
}
export default ChatUpdate;