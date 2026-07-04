import {SocialMedias} from "../../enums.js";

type ProfileSocialAccount = {
    "id": string,
    "socialNetwork": SocialMedias,
    "isVerified": boolean,
    "url": string,
    "displayName": string,
    "value": string,
    "accessPermission": "public"|"mutuals"|"liked",
    "__typename": "ProfileSocialAccount"
}
export default ProfileSocialAccount;