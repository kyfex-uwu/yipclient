import {addCss} from "./index.js";
import {html} from "@arrow-js/core";

addCss(`
.icon{
    display:inline-block;
    aspect-ratio:1/1;
    height:2ex;
    vertical-align:center;

    &.likedBy{
        background: black;
        mask-mode: luminance;
        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0.1 2 2.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-width='.2' d='M.1.5h1.8m0 0v1.2m0 0H.1m0 0V.5m0 0 .9.6m0 0 .9-.6'/%3E%3Cpath fill='%23fff' stroke='%23000' stroke-linecap='round' stroke-width='.4' d='M1 .95c-.2-.36-.48.08 0 .4m0 0c.48-.32.2-.76 0-.4'/%3E%3Cpath fill='%23fff' stroke='%23fff' stroke-linecap='round' stroke-width='.1' d='M1 .95c-.2-.36-.48.08 0 .4m0 0c.48-.32.2-.76 0-.4'/%3E%3C/svg%3E");
    }
    &.liked{
        background: black;
        mask-mode: luminance;
        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0.1 2 2.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-width='.2' d='M1 .8c-.5-.9-1.2.2 0 1m0 0c1.2-.8.5-1.9 0-1'/%3E%3C/svg%3E");
    }
    &.mutual{
        background: black;
        mask-mode: luminance;
        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0.05 0 2.05 2' xmlns='http://www.w3.org/2000/svg' fill='%23fff'%3E%3Cg transform='rotate(10 2.393 2.815)'%3E%3Cpath stroke='%23fff' stroke-width='.1' stroke-linecap='round' stroke-linejoin='round' d='M.8 1.1c-.1.3.1.2.2.2s.3.1.2-.2-.3-.3-.4 0'/%3E%3Cellipse cx='.8' cy='.85' rx='.13' ry='.18' transform='rotate(-25 .8 1.3)'/%3E%3Cellipse cx='1.2' cy='.85' rx='.13' ry='.18' transform='rotate(25 1.2 1.3)'/%3E%3Cellipse cx='.95' cy='.6' rx='.15' ry='.2' transform='rotate(-10 .95 1.3)'/%3E%3Cellipse cx='1.05' cy='.6' rx='.15' ry='.2' transform='rotate(10 1.05 1.3)'/%3E%3C/g%3E%3Cg fill='%23000' transform='rotate(-10 2.093 2.815)'%3E%3Cpath stroke='%23000' stroke-width='.3' stroke-linecap='round' stroke-linejoin='round' d='M.8 1.1c-.1.3.1.2.2.2s.3.1.2-.2-.3-.3-.4 0' fill='none'/%3E%3Cellipse cx='.8' cy='.85' rx='.23' ry='.28' transform='rotate(-25 .8 1.3)'/%3E%3Cellipse cx='1.2' cy='.85' rx='.23' ry='.28' transform='rotate(25 1.2 1.3)'/%3E%3Cellipse cx='.95' cy='.6' rx='.25' ry='.3' transform='rotate(-10 .95 1.3)'/%3E%3Cellipse cx='1.05' cy='.6' rx='.25' ry='.3' transform='rotate(10 1.05 1.3)'/%3E%3C/g%3E%3Cg transform='rotate(-10 2.093 2.815)'%3E%3Cpath stroke='%23fff' stroke-width='.1' stroke-linecap='round' stroke-linejoin='round' d='M.8 1.1c-.1.3.1.2.2.2s.3.1.2-.2-.3-.3-.4 0'/%3E%3Cellipse cx='.8' cy='.85' rx='.13' ry='.18' transform='rotate(-25 .8 1.3)'/%3E%3Cellipse cx='1.2' cy='.85' rx='.13' ry='.18' transform='rotate(25 1.2 1.3)'/%3E%3Cellipse cx='.95' cy='.6' rx='.15' ry='.2' transform='rotate(-10 .95 1.3)'/%3E%3Cellipse cx='1.05' cy='.6' rx='.15' ry='.2' transform='rotate(10 1.05 1.3)'/%3E%3C/g%3E%3C/svg%3E");
    }
    &.friend{
        background: black;
        mask-mode: luminance;
        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0.05 0 2.05 2' xmlns='http://www.w3.org/2000/svg' fill='%23fff'%3E%3Cg transform='rotate(10 2.393 2.815)'%3E%3Cpath stroke='%23fff' stroke-width='.1' stroke-linecap='round' stroke-linejoin='round' d='M.8 1.1c-.1.3.1.2.2.2s.3.1.2-.2-.3-.3-.4 0'/%3E%3Cellipse cx='.8' cy='.85' rx='.13' ry='.18' transform='rotate(-25 .8 1.3)'/%3E%3Cellipse cx='1.2' cy='.85' rx='.13' ry='.18' transform='rotate(25 1.2 1.3)'/%3E%3Cellipse cx='.95' cy='.6' rx='.15' ry='.2' transform='rotate(-10 .95 1.3)'/%3E%3Cellipse cx='1.05' cy='.6' rx='.15' ry='.2' transform='rotate(10 1.05 1.3)'/%3E%3C/g%3E%3Cg fill='%23000' transform='rotate(-10 2.093 2.815)'%3E%3Cpath stroke='%23000' stroke-width='.3' stroke-linecap='round' stroke-linejoin='round' d='M.8 1.1c-.1.3.1.2.2.2s.3.1.2-.2-.3-.3-.4 0' fill='none'/%3E%3Cellipse cx='.8' cy='.85' rx='.23' ry='.28' transform='rotate(-25 .8 1.3)'/%3E%3Cellipse cx='1.2' cy='.85' rx='.23' ry='.28' transform='rotate(25 1.2 1.3)'/%3E%3Cellipse cx='.95' cy='.6' rx='.25' ry='.3' transform='rotate(-10 .95 1.3)'/%3E%3Cellipse cx='1.05' cy='.6' rx='.25' ry='.3' transform='rotate(10 1.05 1.3)'/%3E%3C/g%3E%3Cg transform='rotate(-10 2.093 2.815)'%3E%3Cpath stroke='%23fff' stroke-width='.1' stroke-linecap='round' stroke-linejoin='round' d='M.8 1.1c-.1.3.1.2.2.2s.3.1.2-.2-.3-.3-.4 0'/%3E%3Cellipse cx='.8' cy='.85' rx='.13' ry='.18' transform='rotate(-25 .8 1.3)'/%3E%3Cellipse cx='1.2' cy='.85' rx='.13' ry='.18' transform='rotate(25 1.2 1.3)'/%3E%3Cellipse cx='.95' cy='.6' rx='.15' ry='.2' transform='rotate(-10 .95 1.3)'/%3E%3Cellipse cx='1.05' cy='.6' rx='.15' ry='.2' transform='rotate(10 1.05 1.3)'/%3E%3C/g%3E%3Cpath fill='none' stroke='%23000' stroke-width='.4' stroke-linecap='round' d='M1.4 1v.6m-.3-.3h.6'/%3E%3Cpath fill='none' stroke='%23fff' stroke-width='.2' stroke-linecap='round' d='M1.4 1v.6m-.3-.3h.6'/%3E%3C/svg%3E");
    }
    
    &.send{
        background: black;
        mask-mode: luminance;
        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23fff' d='M1.3 1 .3.85C.2.6.2.2.6.3l1.1.5c.2.1.2.3 0 .4l-1.1.5c-.4.1-.4-.3-.3-.55'/%3E%3C/svg%3E");
    }
    
    &.boop{
        background: black;
        mask-mode: luminance;
        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-width='.2' d='M.19.9 1 .98c0 .92-.35.82-.53.85M.88.51C.88.41.87.24.83.14m.53.47c.04-.07.24-.27.3-.33m-.25.81.4.1'/%3E%3Cpath d='M.62.95c-.03.17.23.52.31.52.15.01.35-.42.27-.62S.62.82.62.95' fill='%23fff'/%3E%3C/svg%3E");
    }
    
    &.swipemore{
        aspect-ratio:3/1;
    
        background: black;
        mask-mode: luminance;
        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 6 2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='.4' d='M.2.2 3 1 5.8.2M.2.8l2.8.8L5.8.8'/%3E%3C/svg%3E");
    }
    
    &.camera{
        background: black;
        mask-mode: luminance;
        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='.2' d='M.5 1.2v1.5a.2.2 0 0 0 .2.2h2.6a.2.2 0 0 0 .2-.2V1.2a.2.2 0 0 0-.2-.2h-.6L2.5.5h-1l-.2.5H.7a.2.2 0 0 0-.2.2'/%3E%3Cellipse cx='2' cy='1.85' rx='.6' fill='%230000' stroke='%23fff' stroke-width='.2'/%3E%3C/svg%3E");
    }
}
`);

type icon = "likedBy"|"liked"|"mutual"|"friend"|"send"|"boop"|"swipemore"|"camera"
const icon = (type:icon)=>html`<span class="${`icon ${type}`}"></span>`;
export default icon;