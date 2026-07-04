import Place from "../Place.js";

type ProfileLocation = {
    "type": "gps",
    "homePlace": Place|null,
    "place": Place,
    "distance": number

    "__typename": "ProfileLocation",
}
export default ProfileLocation;