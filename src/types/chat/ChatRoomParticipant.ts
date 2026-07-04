import Profile from "../profile/Profile.js";

type ChatRoomParticipant = {
        "id": number,
        "profile": Profile,
        "lastReadAt": null,
        "lastReadSeqId": 5,

        "__typename": "ChatRoomParticipant"
    }
export default ChatRoomParticipant;