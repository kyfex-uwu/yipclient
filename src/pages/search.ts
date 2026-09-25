import {html} from "@arrow-js/core";
import {addCss, mainRouter, self} from "../index.js";
import {tiks} from '@rexa-developer/tiks';
import {ref} from "arrowjs-aluminum";
import {getImage} from "../utils.js";
import icon from "../icon.js";
import {ProfileRelationType, searchProfiles, SearchProfiles200EdgesItem} from "../api.js";

addCss(`
.profileList{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6em, 1fr));
    gap: 0.6em;
    padding:1.3em;

    & .profile{
        aspect-ratio: 1/1;
        border-radius: 0.5em;
        cursor:pointer;
        position:relative;
        background-color:#666;
        display:flex;
        overflow:clip;
        
        transition: transform 0.2s;
        
        & img{
            width:100%;
            height:100%;
            object-fit:cover;
            object-position:center center;
        }
        
        &:hover{
            transform:scale(1.05, 1.05);
        }
        &:active{
            transform:scale(0.95, 0.95);
        }
    
        & .position{
            position:absolute;
            bottom:0.2em;
            left:0.2em;
            background-color:#000d;
            color:white;
            padding:0.2em 0.3em;
            border-radius:0.5em;
            user-select:none;
        }
        
        & .travelling{
            aspect-ratio: 1/1;
            height: 15%;
            background-color: #0008;
            border-radius: 50%;
            position:absolute;
            top:0.3em;
            left:0.3em;
            box-shadow: 0 0 0.3em #fff;
        }
        
        & .like-icon{
            position:absolute;
            top:0.2em;
            right:0.2em;
        }
    }
}
`);

function formatDistance(distance:number, format:'imperial'|'metric'){
    return html`${distance} ${format==='imperial'?"mi":'km'}`
}

function profileButton(profile:SearchProfiles200EdgesItem){
    return html`${mainRouter.link(`/fuzzbutt/${profile.node.uuid}`, {
        class:"profile",
        "@hover":()=>tiks.hover(),
        "@click":()=> {
            tiks.click();
        },
    })`
        ${profile.node.primaryImage ? getImage(profile.node.primaryImage, {canExpand:false}) : ''}
        ${profile.distance !== undefined ? html`
            <div class="position">${formatDistance(profile.distance, 'imperial')}</div>
        ` : ''}
        ${profile.relationType ? html`<div class="${`like-icon ${profile.relationType}`}">
            ${({
        [ProfileRelationType.friend]:icon("friend"),
        [ProfileRelationType.liked]:icon("liked"),
        [ProfileRelationType.likedBy]:icon("likedBy"),
        [ProfileRelationType.mutual]:icon("mutual"),
    })[profile.relationType]}
        </div>` : ''}
        ${/*<div class="travelling"></div>*/''}`}`;
}

export default (vars:{[p:string]:string}, state:{[k:string]:string})=>{
    const searchData = ref<SearchProfiles200EdgesItem[]|undefined>(undefined);

    navigator.geolocation.getCurrentPosition((pos)=>{
        search(pos.coords.latitude, pos.coords.longitude);
    },()=>{
        search(0,0);
    });
    function search(x:number, y:number){
        searchProfiles({
            // age?: {
            //     max?: number
            //     min?: number
            // }
            // displayName?: string
            // eventIds?: number[]
            // genders?: string[]
            // groupIds?: number[]
            // homeLocation?: {
            //     placeId?: number
            //     type?: SearchProfilesHomeLocationType
            // }
            // interests?: string[]
            // isLocal?: boolean
            // kinks?: string[]
            location: {
                placeId:self.value?.profile.location?.place?.id,
                type: "distance",
                distance: 10,
            },
            // lookingForPartner?: boolean
            // maxMinutesSinceLastOnline?: number
            // openRelationship?: boolean
            // relationTypes?: ProfileRelationType[]
            // relationshipStatuses?: string[]
            // requireProfileImage?: boolean
            // sexPositions?: SearchProfilesSexPositionsItem[]
            // sexualOrientations?: string[]
            // species?: string[]
            // temporaryStatuses?: string[]
            cursor: undefined,
            // isAd?: boolean
            pageSize: 21,
        }).then(v=>searchData.value = v.data.edges);
    }

    return html`${()=>searchData.value === undefined ? '' : html`
        <div class="profileList">
            ${searchData.value.map(profile=>profileButton(profile))}
        </div>
    `}`;
}