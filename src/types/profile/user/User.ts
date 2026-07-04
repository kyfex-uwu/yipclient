import Profile from "../Profile.js";
import ActivitySummary from "./ActivitySummary.js";
import BlockedContent from "./BlockedContent.js";

type User = {
    profile:Profile,
    blockedContent:BlockedContent
    isAdOptIn:boolean,
    isExplicitContentOptIn:boolean,
    isHardContentOptIn:boolean,
    isOnboarded:boolean,
    likeCount:number,
    mutualCount:number,
    activitySummary:ActivitySummary

    __typename:"User"
}

export default User;