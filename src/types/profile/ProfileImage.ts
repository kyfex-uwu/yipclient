import UploadedImage from "../UploadedImage.js";

type ProfileImage = {
    "id":"133521",//todo
    "image":UploadedImage,
    "accessPermission":"public"|"liked"|"friends",
    "isAd":boolean,
    "likeCount":number,
    "hasLiked":boolean,

    "__typename":"ProfileImage",
}
export default ProfileImage;