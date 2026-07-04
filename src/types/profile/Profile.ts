import UUID from "../UUID.js";
import UploadedImage from "../UploadedImage.js";
import PrivacySettings from "../PrivacySettings.js";
import ProfileImage from "./ProfileImage.js";
import ProfileLocation from "./ProfileLocation.js";
import ProfileBio from "./ProfileBio.js";
import ProfileSocialAccount from "./ProfileSocialAccount.js";
import Sona from "../Sona.js";
import ProfileGroup from "./ProfileGroup.js";
import ProfileBioAd from "./ProfileBioAd.js";

type Profile = {
    "__typename": "Profile",

    "id": string,
    "uuid": UUID,
    "displayName": string,
    "username": string|null,
    "relationType": 'friend'|'liked'|'likedBy'|'mutual'|null,
    "isAdOptIn": boolean,
    "isBirthday": boolean,
    "age": number|null,
    "primaryImage": UploadedImage|null,
    "primaryImageAd": UploadedImage|null,
    "headerImage": UploadedImage|null,
    "headerImageAd": UploadedImage|null,
    "privacySettings": PrivacySettings,
    "images": ProfileImage[],
    "location": ProfileLocation,
    "bio": ProfileBio,
    "socialAccounts": ProfileSocialAccount[],
    "bioAd": ProfileBioAd|null,
    "sonas": Sona[],
    "kinks": {}[],
    "groups": ProfileGroup[],
    "events": {}[],
    "roles": null,
    "shareHash": string
}
export default Profile;