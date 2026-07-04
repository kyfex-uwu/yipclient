import UploadedImage from "./UploadedImage.js";
import UUID from "./UUID.js";

type Group = {
    "uuid": UUID,
    "displayName": string,
    "isAd": boolean,
    "isVerified": boolean,
    "image": UploadedImage,
    "__typename": "Group"
}
export default Group;