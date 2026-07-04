import UploadedImage from "./types/UploadedImage.js";
import {ArrowTemplate, html, reactive} from "@arrow-js/core";
import {addCss} from "./index.js";
import {decodeBlurHash} from "fast-blurhash";
import {ref} from "arrowjs-aluminum";

//--

export function style(style:{[k:string]:string}){
    return Object.entries(style).map(([k,v])=>`${k}:${v}`).join("; ")
}

//--

addCss(`
.image-modal{
    position:fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    pointer-events: none;
    text-align:center;
    z-index:1000;
    
    background-color:#0000;
    backdrop-filter: blur(0);
    transition: background-color 0.4s, backdrop-filter 0.4s;
    
    & .img{
        opacity:0;
        transition: opacity 0.4s;
    }
    
    &.active{
        background-color:#0008;
        backdrop-filter: blur(0.3em);
        pointer-events: initial;
        
        & .img{
            opacity:1;
        }
    }
}

.img{
    position:relative;
    display:inline-block;
    
    & canvas{
        width:100%;
        height:100%;
        position:absolute;
        z-index:-1;
    }
    
    & img{
        width:100%;
        height:100%;
    }
}
`);
const iModalImage = reactive({img:undefined! as UploadedImage, active:false})
export const imageModal = html`<div class="${
    ()=>`image-modal${iModalImage.active ? ' active' : ''}`}" @click="${(e:PointerEvent)=>{
        if(!(e.target instanceof HTMLImageElement)) iModalImage.active=false;
    }}">
    ${()=>iModalImage.img !== undefined ? getImage(iModalImage.img, {canExpand:false, width:false, style:style({
        'max-width':'80vw',
        'max-height':'80vh',
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)',
    })}) : ''}
</div>`

export function getImageLink(image:UploadedImage|null|undefined, data:{width?:number|false}={}){
    if(!image) return '';
    return `https://assets.barq.app/image/${image.uuid}.${(image.mimeType??'image/jpeg').slice("image/".length)
        }${data.width!==false ? `?width=${data.width??512}` : ''}`;
}
export function openImage(image:UploadedImage|null|undefined){
    if(!image) return;
    //@ts-expect-error
    iModalImage.img
        = image;
    iModalImage.active = true;
}
export function getImage(image:UploadedImage|null|undefined, data:{width?: number|false, style?:string|(()=>string), clazz?:string|(()=>string), canExpand?:boolean}={},
                         insides?:ArrowTemplate){

    let canvas:HTMLCanvasElement|undefined=undefined;
    if(image?.blurHash){
        const pixels = decodeBlurHash(image.blurHash, 32, 32);
        canvas = document.createElement('canvas');
        canvas.width=32;
        canvas.height=32;
        const ctx = canvas.getContext('2d')!;
        const imageData = ctx.createImageData(32,32);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);
    }


    return html`<span style="${data.style??""}" class="${`img ${data.clazz??""}`}"  @loadel="${(el:HTMLSpanElement)=>{
            if(canvas) el.prepend(canvas);
        }}">
        <img src="${getImageLink(image, data)
        }" @click="${data.canExpand??true ? ()=> openImage(image) : undefined}">
        ${insides}
    </span>`
}

//--

const el = document.createElement("span");
export function sanitize(text:string){
    el.textContent=text;
    return el.innerHTML;
}

//--

export type primitive = string | number | boolean | undefined | null
export type primObj = {[k:string]:primitive|primObj|primitive[]|primObj[]}

//--

export function textSvg(text:string, data:{style?: string, clazz?: string}={}){
    const size = ref<undefined|{width:number,height:number}>(undefined);
    return html`<svg xmlns="http://www.w3.org/2000/svg" 
            viewBox="${()=>size.value === undefined ? '0 0 1 1' : `0 0 ${size.value.width} ${size.value.height}`}" 
            width="${()=>size.value === undefined ? '1' : false}"
            height="${()=>size.value === undefined ? '1' : false}"
            style="${()=>size.value === undefined ? '' : data.style ?? false}"
            class="${()=>size.value === undefined ? '' : data.clazz ?? false}">
        <foreignObject
                width="${()=>size.value === undefined ? '1' : size.value.width}"
                height="${()=>size.value === undefined ? '1' : size.value.height}">
            <div style="width:fit-content; font-size:10px; white-space: nowrap" @loadel="${(self:HTMLDivElement)=>{
                if(size.value!==undefined) return;
                
                setTimeout(()=>{
                    const bbox = self.getBoundingClientRect();
                    size.value = {width:bbox.width, height:bbox.height};
                },0);
            }}">${text}</div>
        </foreignObject>
    </svg>`
}

const fileInput = document.createElement("input");
let fileEvent=(el:File)=>{};
fileInput.type="file";
fileInput.addEventListener("change",()=>{
    fileEvent(fileInput.files![0]);
})
export async function requestFile(accept:string){
    const filePromise = new Promise<File>(r=>fileEvent=r);

    fileInput.accept = accept;
    fileInput.click();

    return await filePromise;
}