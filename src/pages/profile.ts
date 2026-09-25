import {html, ArrowTemplate} from "@arrow-js/core";
import {computed, ref} from "arrowjs-aluminum";
import {
    getImage,
    openImage,
    requestFile,
    sanitize,
    sanitizeText,
    SocialMedia,
    style,
    textSvg,
    waitFor
} from "../utils.js";
import {addCss, mainRouter, self} from "../index.js";
import icon from "../icon.js";
import {
    AccessPermission,
    getPrivateChatRoom,
    getProfileDetail,
    GetProfileDetail200,
    likeProfile, listProfileImages, ListProfileImages200, ProfileRelationType,
    setUserHeaderImage,
    upsertPrivateChatRoom
} from "../api.js";

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
            
            & > button, & > a{
                margin:0 0.5em;
                text-align:center;
                padding:0.3em 0 0 0;
                display:block;
                color:var(--black);
                background-color: transparent;
                border: none;
                font-size:inherit;
                font-family:inherit;
                text-decoration:none;
                
                & .icon{
                    margin-right:0;
                    background-color:var(--black);
                }
                & > div{
                    display:none;
                }
                
                &.unactionable{
                    opacity:0.7;
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
                
                & > button, & > a{
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
                
                    &:not(.unactionable):hover{
                        background-color:color-mix(var(--white), var(--primary) 50%);
                        box-shadow: 0 0 0.2em var(--primary) inset;
                    }    
                    
                    &.unactionable{
                        cursor:default;
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
    
   & .passthrough-children{
        pointer-events:none;
        & > *:not(.passthrough-children){
            pointer-events:auto;
        }
    }
    
    & .interests span{
        margin-right:0.5em;
        
        &:not(:last-child)::after{
            content: "-";
            margin-left:0.5em;
        }
    }
}
`);

export default (vars:{[k:string]:string}, state:{[k:string]:string})=>{
    //userId
    const profileData = ref<GetProfileDetail200|undefined>(undefined);
    const profileImages = ref<ListProfileImages200|undefined>(undefined);

    getProfileDetail(vars.userId).then(r=> profileData.value = r.data);
    listProfileImages(vars.userId).then(r=>profileImages.value=r.data);

    const isSelf = computed(()=>profileData.value?.profile.uuid === self.value?.profile?.uuid);
    const safeImages = computed(()=>
        profileImages.value?.images.filter(image=>image.image?.contentRating === 'safe' && image.image!==null));

    const chatroomId=ref<number|undefined>(undefined);
    profileData.$on(data=>{
        if(data === undefined) return;
        getPrivateChatRoom(data.profile.uuid)
            .then(async v=>{
                chatroomId.value = v.data.id;
                if(chatroomId.value === undefined)
                    upsertPrivateChatRoom(data.profile.uuid)
                        .then(v2=>{
                            chatroomId.value=v2.data.id;
                        });
            });
    });


    return html`
    <div class="profile-page">
        <div class="header-image" @click="${()=> {
            openImage(profileData.value?.profile.headerImage);
            if(isSelf.value && !profileData.value?.profile.headerImage){
                requestFile("image/*").then(file=>{
                    const a = new FileReader();
                    a.onload = e=>{
                        setUserHeaderImage({
                            image:e.target!.result,
                            isAd:false,
                        })
                    }
                    a.readAsDataURL(file);
                })
            }
        }}">
        ${()=>getImage(profileData.value?.profile.headerImage,
            {style:style({position:"absolute", width:'100%', top:'50%', transform:"translateY(-50%)"}), canExpand:false},
            (isSelf.value && !profileData.value?.profile.headerImage) ? html`${icon('camera')}` : undefined)}
        </div>
        <div style="${style({"position":"relative", top:"-4em", padding:"1em"})}" class="passthrough-children">
            <div style="${style({display:"grid", "grid-template-columns":"2fr 1fr auto", "gap":"0 1.5em"})}" class="passthrough-children">
                <div style="${style({display:"flex","flex-direction":"column"})}" class="passthrough-children">
                    <div style="${style({flex:"1"})}" class="passthrough-children"></div>
                    <div>
                        <div style="${style({"font-size":"1.5em", display:"flex"})}">
                            ${()=>textSvg(profileData.value?.profile.displayName ?? "",{
                                clazz:"profile-name"
                            })}
                            <div>
                            ${()=>profileData.value?.relationType ? 
                                html`<div class="${`like-icon ${profileData.value.relationType}`}">${({
                                    "friend":icon("friend"),
                                    "liked":icon("liked"),
                                    "likedBy":icon("likedBy"),
                                    "mutual":icon("mutual"),
                                })[profileData.value.relationType]}</div>` : ''}
                            </div>
                        </div>
                        <div style="${style({"font-size":"1.1em"})}">${()=>profileData.value?.profile.username === undefined ? '' :
                            html`<span style="${style({opacity:'0.6'})}">@${profileData.value.profile.username}</span>`}</div>
                    </div>
                </div>
                <div class="profile-main-image">
                    ${()=>profileData.value?.profile.primaryImage ?
                        getImage(profileData.value.profile.primaryImage) :
                        ""}
                </div>
                <span style="${style({position: "relative", top:"4em"})}"></span>
                <div style="${style({"font-size":"0.7em", "margin-top":"0.5em"})}">
                    <div>${()=>[
                        profileData.value?.profile.age,
                        profileData.value?.profile.bio?.genders?.join("/"),
                        profileData.value?.profile.bio?.sexualOrientation,
                        profileData.value?.profile.bio?.relationshipStatus
                    ].filter(v=>v).join(" - ")}</div>
                        ${()=>profileData.value?.profile.location?.place ? html`
                        <div>${profileData.value.profile.location.place.place}, ${profileData.value.profile.location.place.region}</div>
                        `:''}
                </div>
                <div class="interaction-menu" style="${()=>profileData.value?.profile.uuid === self.value?.profile?.uuid ? 'display:none' : ''}">
                    <div>
                        <button @click="${()=>{
                            
                        }}">${icon("boop")}<div>Boop</div></button>
                        ${waitFor(profileData, data=>
                            html`<button class="${({
                                [ProfileRelationType.liked]:"unactionable",
                                [ProfileRelationType.likedBy]:"",
                                [ProfileRelationType.mutual]:"",
                                [ProfileRelationType.friend]:"unactionable",
                                none:"",
                            })[data.relationType ?? "none"]}" @click="${()=>{}}">${icon(({
                                [ProfileRelationType.liked]:"liked",
                                [ProfileRelationType.likedBy]:"liked",
                                [ProfileRelationType.mutual]:"friend",
                                [ProfileRelationType.friend]:"friend",
                                none:"liked",
                            } satisfies {[k:string]:icon})[data.relationType ?? "none"])}<div>${({
                                [ProfileRelationType.liked]:"Liked",
                                [ProfileRelationType.likedBy]:"Like Back",
                                [ProfileRelationType.mutual]:"Friend",
                                [ProfileRelationType.friend]:"Friends",
                                none:"Like",
                            })[data.relationType ?? "none"]}</div></button>`
                        )`<button>${icon("loader")}<div>Like</div></button>`}
                        ${waitFor(chatroomId, chatroomId=>
                            html`${mainRouter.link(`/yap/${chatroomId}`)`${icon("send")}<div>Message</div>`}`
                        )`<button>${icon("send")}<div>Message</div></button>`}
                    </div>
                    <div>${icon("swipemore")}</div>
                </div>
            </div>
            
            <div style="${style({"margin-top":"2em", "line-height":'1.5em'})}">
                ${()=>sanitize(profileData.value?.profile.bio?.biography ?? "",{newlineToBr:true})}
            </div>
            <hr style="${style({margin:'2em'})}">
            <div style="${style({display:'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(7em, 1fr))', gap:'1em'})}">
                ${()=>safeImages.value?.map(image=>html`
                    <div class="profile-content-image">
                        ${getImage(image.image, {width:256})}
                    </div>`)}
            </div>
            ${()=>safeImages.value?.length === 0 ? '' : html`<hr style="${style({margin:'2em'})}">`}
            ${()=>profileData.value?.profile.bio?.interests?.length === 0 ? '' : 
                    html`<div class="interests">
                        Interests: ${profileData.value?.profile.bio?.interests?.map(interest=>sanitizeText(interest.displayName))
                                .join(" - ")}
                    </div>
                    <hr style="${style({margin:'2em'})}">`}
            ${()=>profileData.value?.profile.socialAccounts?.map(v=>{
                const strength= profileData.value?.relationType === undefined ? 0 : ({
                    likedBy: 1,
                    mutual: 2,
                    friend: 3,
                } as {[k in ProfileRelationType]:number} )[profileData.value.relationType];
                const socialStrength = v.accessPermission === undefined ? 0 : ({
                    public:0,
                    liked:1,
                    mutuals:2,
                } as {[k in AccessPermission]:number})[v.accessPermission];
                
                if(socialStrength>strength) return '';
                
                return html`<div class="${`profile-social-media ${v.socialNetwork}`}">
                    ${SocialMedia[v.socialNetwork]}: 
                    <a href="${sanitizeText(v.url??"",{encodeQuote:true})}">${sanitize(v.displayName ?? "")}</a>
                    <span style="${style({opacity:'0.5'})}">${sanitize(v.username ?? "")}</span>
                </div>`
            })}
        </div>
    </div>`;
}