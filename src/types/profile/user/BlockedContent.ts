import Profile from "../Profile.js";
import Group from "../../Group.js";

type BlockedContent = {
    profiles:Profile[],
    groups:Group[],

    "__typename": "BlockedContent"
}

export default BlockedContent;