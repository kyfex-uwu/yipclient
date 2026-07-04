import Profile from "../profile/Profile.js";
import ChatRoomMessagePayload from "./ChatRoomMessagePayload.js";
import UUID from "../UUID.js";

type ChatRoomMessage = {
    "id": UUID,
    "seqId": number,
    "createdAt": string,
    "updatedAt": null,
    "deletedAt": null,
    "profile": Profile,
    "payload": ChatRoomMessagePayload,

    "__typename": "ChatRoomMessage"
}
export default ChatRoomMessage;