import Species from "./Species.js";
import ProfileImage from "./profile/ProfileImage.js";

type Sona = {
    "id": string,
    "displayName": string,
    "hasFursuit": boolean,
    "species":Species,
    "images": ProfileImage[],
    "__typename": "Sona"
}
export default Sona;