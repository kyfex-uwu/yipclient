import UUID from "./UUID.js";

type UploadedImage = {
    "uuid":UUID,
    "contentRating":"safe"|"explicit"|null,
    "width":number,
    "height":number,
    "blurHash":string|null,
    type:string,
    "mimeType":string,
    "fileName":null,
    "fileSize":number,
    "fileHash":null,

    "__typename":"UploadedImage"
}
export default UploadedImage