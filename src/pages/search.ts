import {html} from "@arrow-js/core";
import {addCss, mainRouter} from "../index.js";
import {tiks} from '@rexa-developer/tiks';
import {Func, request, VMarker} from "../apiReq.js";
import Profile from "../types/profile/Profile.js";
import {ref} from "arrowjs-aluminum";
import {getImage} from "../utils.js";
import icon from "../icon.js";

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

function profileButton(profile:Profile){
    return html`<a class="profile" href="${`/fuzzbutt/${profile.uuid}`}"
            @hover="${()=>tiks.hover()}"
            @click="${(e:PointerEvent)=> {
                console.log(e)
                tiks.click();
                mainRouter.redirect(`/fuzzbutt/${profile.uuid}`)
            }}">
        ${profile.primaryImage ? getImage(profile.primaryImage, {canExpand:false}) : ''}
        <div class="position">${formatDistance(profile.location.distance, 'imperial')}</div>
        ${profile.relationType ? html`<div class="${`like-icon ${profile.relationType}`}">
            ${({
                "friend":icon("friend"),
                "liked":icon("liked"),
                "likedBy":icon("likedBy"),
                "mutual":icon("mutual"),
            })[profile.relationType]}
        </div>` : ''}
        ${/*<div class="travelling"></div>*/''}
    </a>`;
}

export default (vars:{[p:string]:string}, state:{[k:string]:string})=>{
    const searchData = ref<Profile[]|undefined>(undefined);

    navigator.geolocation.getCurrentPosition((pos)=>{
        search(pos.coords.latitude, pos.coords.longitude);
    },()=>{
        search(0,0);
    });
    function search(x:number, y:number){
        request(new Func<Profile>('profileSearch', {
            filters: new VMarker('filters', 'ProfileSearchFiltersInput!', {
                location:{
                    latitude:x,
                    longitude:y,
                    type:'distance',//"distance"|"city"|"country"|"region"

                    // distance:80,

                },
                // requireProfileImage:true,
                // age:{
                //     min:0,
                //     max:0,
                // },
                // "genders": [
                //     "Male",
                //     "Transgender Female",
                //     "Female",
                //     "Transgender Male",
                //     "Non-Binary"
                // ],
                // "relationshipStatus": [
                //     "relationship",
                //     "other",
                //     "domestic_partnership",
                //     "engaged_married",
                //     "open_relationship",
                //     "single"
                // ],
                // "sexPositions": [
                //     "top",
                //     "bottom"
                // ],
                // "sexualOrientation": [
                //     "straight",
                //     "bisexual",
                //     "gay",
                //     "lesbian",
                //     "pansexual",
                //     "asexual",
                //     "questioning",
                //     "other"
                // ],
            }),
            isAd: new VMarker('isAd', 'Boolean', false),
            cursor: new VMarker('cursor', 'String', ''),
            limit: new VMarker('limit', 'Int', 30),
            sort: 'distance'
        }, {
            uuid:true,
            displayName:true,
            primaryImage: {
                uuid:true,
                contentRating:true,
                blurHash:true,
                mimeType:true,
            },
            primaryImageAd: {
                uuid:true,
                contentRating:true,
                blurHash:true,
                mimeType:true,
            },
            username:true,
            roles:true,
            relationType:true,
            location: {
                distance:true,
                type:true,
                place: {
                    id:true,
                },
                homePlace: {
                    id:true,
                }
            }
        })).then(v=>searchData.value = v);
    }

    return html`${()=>searchData.value === undefined ? '' : html`
        <div class="profileList">
            ${searchData.value.map(profile=>profileButton(profile))}
        </div>
    `}`;
}