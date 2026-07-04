import UploadedImage from "../UploadedImage.js";
import ChatRoomParticipant from "./ChatRoomParticipant.js";
import UUID from "../UUID.js";
import ChatRoomMessage from "./ChatRoomMessage.js";

type ChatRoom = {
    "id": number,
    "createdAt": string,
    "image": UploadedImage,
    "isArchived": false,
    "isRemoved": false,
    "lastReadSeqId": 5,
    "lastSeqId": 5,
    "participantCount": 2,
    "participants": ChatRoomParticipant[],
    "status": "JOINED",
    "title": string,
    "type": "private",
    "uuid": UUID,
    "lastMessage": ChatRoomMessage,
    "lastMessageAt": string,

    "__typename": "ChatRoom",
}
export default ChatRoom;