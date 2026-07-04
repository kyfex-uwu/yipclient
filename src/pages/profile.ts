import {html, ArrowTemplate} from "@arrow-js/core";
import {Func, request, VMarker} from "../apiReq.js";
import Profile from "../types/profile/Profile.js";
import {computed, ref} from "arrowjs-aluminum";
import {getImage, openImage, requestFile, sanitize, style, textSvg} from "../utils.js";
import {addCss, mainRouter, self} from "../index.js";
import {SocialMedia} from "../enums.js";
import ProfileSocialAccount from "../types/profile/ProfileSocialAccount.js";
import icon from "../icon.js";
import ChatRoom from "../types/chat/ChatRoom.js";

addCss(`
.profile-page{
    & .header-image{
        aspect-ratio:2/1;
        width:100%;
        position:relative;
        overflow:clip;
        max-height:30vh;
        background-color: color-mix(var(--white), transparent 90%);
        
        & .img{
            text-align:center;
            
            & .icon{
                background-color:var(--white);
                height:4em;
            }
        }
        
        &:has(.icon){
            & .icon{
                transition:scale 0.2s;
                scale:1;
            }
            &:hover .icon{
                scale:1.1;
            }
        }
    }

    & .profile-name{
        max-height: 1.5em;
        margin-right:0.3em;
    }

    & .like-icon{
        transition: scale 0.2s;
        vertical-align:middle;
    }

    & .profile-main-image{
        aspect-ratio: 1/1;
        overflow: clip;
        display: flex;
        border-radius:10%;
        border:solid white 0.3em;
        z-index:1;
        
        & .img img{
            width:100%;
            height:100%;
            object-fit:cover;
            object-position:center center;
        }
    }
    & .profile-content-image{
        aspect-ratio: 1/1;
        overflow: clip;
        border-radius: 1em;
        display:flex;
        cursor:pointer;
        
        transition: transform 0.2s;
        
        & img{
            object-fit: cover;
            object-position: center center;
            width: 100%;
            height: 100%;
        }
        
        &:hover{
            transform: scale(1.05, 1.05);
        }
        &:active{
            transform: scale(0.95, 0.95);
        }
    }
    & .profile-social-media{
        --color:var(--white);
    
        border: solid var(--color) 2px;
        margin: 0.6em;
        padding: 0.6em;
        border-radius: 0.6em;
        background-color: color-mix(var(--color), transparent 80%);
        
        &.bluesky{ --color:#01A6FF; }
        &.deviantArt{ --color:#05CC46; }
        &.discord{ --color:#5865F2; }
        &.furAffinity{ --color:#ff7700 }
        &.instagram{ --color:#d62976 }
        &.lastfm{ --color:#D51007 }
        &.mastodon{ --color:#6364FF }
        &.steam{ --color:#00adee }
        &.telegram{ --color:#24A1DE }
        &.twitter{ --color:#1da1f2; }
        &.twitterAd{ --color:#0a396a }
        &.vrChat{ --color:#156CCD }   
    }
    
    & .interaction-menu{
        position:relative;
        height:0;
        transform:translateY(-1em);
        background-color: var(--primary);
        border-radius: 0 0 0.6em 0.6em;
        color:var(--black);
        
        
        &::before{
            content:'';
            background-color: var(--primary);
            height: 1em;
            width: 100%;
            display: block;
        }
        
        & > *:first-child{
            background-color:var(--primary);
            padding-top:0.3em;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            
            &:has(.none){
                grid-template-columns: 1fr 0 1fr;
            }
            
            & > button{
                margin:0 0.5em;
                text-align:center;
                padding:0.3em 0 0 0;
                display:block;
                color:var(--black);
                background-color: transparent;
                border: none;
                font-size:inherit;
                font-family:inherit;
                
                & .icon{
                    margin-right:0;
                    background-color:var(--black);
                }
                & > div{
                    display:none;
                }
            }
        }
        
        & > *:last-child{
            height: 1.3em;
            padding:0.4em 0.5em 0 0.5em;
            background-color:var(--primary);
            border-radius: 0 0 0.5em 0.5em;
            text-align:center;
            
            & .icon{
                height:0.6em;
                background-color:color-mix(var(--black), transparent 60%);
                margin-right:0;
                vertical-align:text-top;
            }   
        }
        
        &:hover{
            & > *:first-child{
                display: flex;
                flex-direction: column;
                
                & > button{
                    margin:0.3em 0.3em 0 0.3em;
                    text-align: left;
                    padding:0.2em 0.4em;
                    border-radius:1em;
                    cursor:pointer;
                    
                    & > div{
                        display:unset;
                    }
                    & > .icon{
                        margin-right:0.4em;
                    }
                    
                    &:first-child{
                        margin-top:0.1em;
                    }   
                
                    &:hover{
                        background-color:color-mix(var(--white), var(--primary) 50%);
                        box-shadow: 0 0 0.2em var(--primary) inset;
                    }                
                }
                & > .none{
                    margin:0.4em 1.5em 0 1.5em;
                    padding-top:0;
                    height:0.1em;
                    background-color:color-mix(var(--black),transparent 70%);
                    border-radius:1em;
                }
            }
        }
    }
    
    .passthrough-children{
        pointer-events:none;
        & > *:not(.passthrough-children){
            pointer-events:auto;
        }
    }
}
`);

export default (vars:{[k:string]:string}, state:{[k:string]:string})=>{
    //userId
    const profileData = ref<Profile|undefined>(undefined);
    const relationOption = computed<[string, ArrowTemplate, ()=>void]|undefined>(()=>{
        switch(profileData.value?.relationType){
            case "friend": case "liked": return;
            case "mutual": return ["Friend", icon("friend"), ()=>{

            }];
        }

        return [(profileData.value?.relationType === "likedBy") ? "Like Back" : "Like", icon("liked"), ()=>{
            request(new Func('likeProfile', {
                uuid:new VMarker('uuid', 'String!', profileData.value?.uuid)
            },{
                likeProfile:true
            }), {type:"mutation"});
        }];

    });
    const isSelf = computed(()=>profileData.value?.uuid === self.value?.profile?.uuid);

    request<{ profile:Profile }>({profile:{
        uuid:new VMarker('uuid', 'String!', vars.userId),

        id: true,
        displayName: true,
        username: true,
        relationType: true,
        isAdOptIn: true,
        isBirthday: true,
        age: true,
        primaryImage: {
            uuid: true,
            contentRating: true,
            width: true,
            height: true,
            blurHash: true,
            mimeType:true,
        },
        primaryImageAd: {
            uuid: true,
            contentRating: true,
            width: true,
            height: true,
            blurHash: true,
            mimeType:true,
        },
        headerImage: {
            uuid: true,
            contentRating: true,
            width: true,
            height: true,
            blurHash: true,
            mimeType:true,
        },
        headerImageAd: {
            uuid: true,
            contentRating: true,
            width: true,
            height: true,
            blurHash: true,
            mimeType:true,
        },
        privacySettings: {
            startChat: true,
            viewKinks: true,
            viewAge: true,
            viewAd: true,
            viewProfile: true,
            showLastOnline: true,
        },
        images: {
            image: {
                uuid: true,
                contentRating: true,
                width: true,
                height: true,
                blurHash: true,
                mimeType: true,
            },
            accessPermission: true,
            isAd: true,
            likeCount: true,
            hasLiked: true,
        },
        location: {
            type: true,
            homePlace: {
                id: true,
                place: true,
                region: true,
                country: true,
                countryCode: true,
                longitude: true,
                latitude: true,
            },
            place: {
                id: true,
                place: true,
                region: true,
                country: true,
                countryCode: true,
                longitude: true,
                latitude: true,
            },
            distance: true,
        },
        bio: {
            "biography": true,
            "genders": true,
            "languages": true,
            "relationshipStatus": true,
            "sexualOrientation": true,
            "interests": true,
            "hobbies": {
                interest: true,
            }
        },
        socialAccounts: {
            id: true,
            socialNetwork: true,
            isVerified: true,
            url: true,
            displayName: true,
            value: true,
            accessPermission: true,
        },
        bioAd: {
            biography: true,
            sexPositions: true,
            behaviour: true,
            safeSex: true,
            canHost: true,
        },
        sonas: {

        },
        kinks: {

        },
        groups: {

        },
        events: {

        },
        roles: true,
        shareHash: true,

    }}).then(json=> profileData.value = json.profile);

    return html`${()=>profileData.value === undefined ? 'Loading' : html`
    <div class="profile-page">
        <div class="header-image" @click="${()=> {
            openImage(profileData.value?.headerImage);
            if(isSelf.value && !profileData.value?.headerImage){
                requestFile("image/*").then(file=>{
                    const a = new FileReader();
                    a.onload = e=>{
                        request(new Func<Profile>('userSetHeaderImage',{
                            image:new VMarker('image', 'String', e.target!.result),
                        },{
                            headerImage:{
                                uuid: true,
                                contentRating:true,
                                width: true,
                                height: true,
                                blurHash: true,
                                type: true,
                                mimeType: true,
                                fileName: true,
                                fileSize: true,
                                fileHash: true,
                            },
                            __typename:true,
                        }), {type:"mutation"});
                    }
                    a.readAsDataURL(file);
                })
            }
        }}">
            ${getImage(profileData.value.headerImage, 
                {style:style({position:"absolute", width:'100%', top:'50%', transform:"translateY(-50%)"}), canExpand:false},
            (isSelf.value && !profileData.value.headerImage) ? html`${icon('camera')}` : undefined)}
        </div>
        <div style="${style({"position":"relative", top:"-4em", padding:"1em"})}" class="passthrough-children">
            <div style="${style({display:"grid", "grid-template-columns":"2fr 1fr", "gap":"0 1.5em"})}" class="passthrough-children">
                <div style="${style({display:"flex","flex-direction":"column"})}" class="passthrough-children">
                    <div style="${style({flex:"1"})}" class="passthrough-children"></div>
                    <div>
                        <div style="${style({"font-size":"1.5em", display:"flex"})}">
                            ${textSvg(profileData.value.displayName,{
                                clazz:"profile-name"
                            })}
                            <div>
                            ${profileData.value.relationType ? 
                                html`<div class="${`like-icon ${profileData.value.relationType}`}">${({
                                    "friend":icon("friend"),
                                    "liked":icon("liked"),
                                    "likedBy":icon("likedBy"),
                                    "mutual":icon("mutual"),
                                })[profileData.value.relationType]}</div>` : ''}
                            </div>
                        </div>
                        <div style="${style({"font-size":"1.1em"})}">${profileData.value.username === null ? '' :
                                html`<span style="${style({opacity:'0.6'})}">@${profileData.value.username}</span>`}</div>
                    </div>
                </div>
                <div class="profile-main-image">
                    ${profileData.value.primaryImage ?
                        getImage(profileData.value.primaryImage) :
                        ""}
                </div>
                <div style="${style({"font-size":"0.7em", "margin-top":"0.5em"})}">
                    <div>${[
                        profileData.value.age,
                        profileData.value.bio.genders?.join("/"),
                        profileData.value.bio.sexualOrientation,
                        profileData.value.bio.relationshipStatus
                    ].filter(v=>v).join(" - ")}</div>
                        <div>${profileData.value.location.place.place}, ${profileData.value.location.place.region}</div>
                </div>
                <div class="interaction-menu" style="${profileData.value.uuid === self.value?.profile?.uuid ? 'display:none' : ''}">
                    <div>
                        ${([
                            ["Boop", icon("boop"), ()=>{
                                
                            }],
                            relationOption.value,
                            ["Chat", icon("send"), (e:PointerEvent)=> {
                                request(new Func<ChatRoom>('chatRoomPrivate',{
                                    profileUuid:new VMarker('profileUuid','String!',profileData.value?.uuid)
                                },{
                                    id: true
                                })).then(async v=>{
                                    let id = v[0]?.id;
                                    if(id === undefined){
                                        await request(new Func<ChatRoom>('chatRoomCreatePrivate',{
                                            profileUuid:new VMarker('profileUuid', 'String!', profileData.value?.uuid)
                                        },{
                                            id:true,
                                        }), {type:"mutation"}).then(v2=>{
                                            id=v2[0]?.id;
                                        });
                                    }
                                    
                                    if(id !== undefined) {
                                        if (e.ctrlKey) window.open(`/yap/${id}`, "_blank");
                                        else mainRouter.redirect(`/yap/${id}`);
                                    }
                                })
                            }]
                        ] satisfies ([string,ArrowTemplate, (...v:any)=>void]|undefined)[]).map(v=>
                                v === undefined ? 
                                    html`<div class="none"></div>` : 
                                    html`<button @click="${v[2]}">${v[1]}<div>${v[0]}</div></button>`)}
                    </div>
                    <div>${icon("swipemore")}</div>
                </div>
            </div>
            
            <div style="${style({"margin-top":"2em", "line-height":'1.5em'})}">
                ${sanitize(profileData.value.bio.biography).replaceAll("\n","<br>")}
            </div>
            <hr style="${style({margin:'2em'})}">
            <div style="${style({display:'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(7em, 1fr))', gap:'1em'})}">
                ${profileData.value.images.filter(image=>image.image?.contentRating === 'safe' && image.image !== null)
                    .map(image=>html`
                    <div class="profile-content-image">
                        ${getImage(image.image, {width:256})}
                    </div>`)}
            </div>
            ${profileData.value.images.filter(image=>image.image?.contentRating === 'safe' && image.image!==null)
                    .length === 0 ? '' : html`<hr style="${style({margin:'2em'})}">`}
            ${profileData.value.socialAccounts.map(v=>{
                const strength= ({
                    likedBy: 1,
                    mutual: 2,
                    friend: 3,
                } as {[k:string]:number} )[profileData.value?.relationType ?? ''] ?? 0;
                const socialStrength = ({
                    public:0,
                    liked:1,
                    mutuals:2
                } as {[k in ProfileSocialAccount['accessPermission']]:number})[v.accessPermission] ?? 0;
                
                if(socialStrength>strength) return '';
                
                return html`<div class="${`profile-social-media ${v.socialNetwork}`}">
                    ${SocialMedia[v.socialNetwork]}: 
                    <a href="${sanitize((v.url??"").replaceAll('"', "%22"))}">${sanitize(v.displayName)}</a>
                    <span style="${style({opacity:'0.5'})}">${sanitize(v.value)}</span>
                </div>`
            })}
        </div>
    </div>`}`;
}