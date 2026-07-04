import Interest from "../Interest.js";

type ProfileBio = {
    "biography": string
    "genders": string[],
    "languages": string[],
    "relationshipStatus": string|"open_relationship"|"dating",
    "sexualOrientation": string|"bisexual"|"asexual",
    "interests": null,
    "hobbies": Interest[],

    "__typename": "ProfileBio"
}
export default ProfileBio;