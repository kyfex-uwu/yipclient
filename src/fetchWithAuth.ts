import {token} from "./index.js";

const baseURL = 'https://api.barq.app'; // use your own URL or environment variable

export const fetchWithAuth = async <T extends {
    headers:Headers
    data: any
    status: number
}>(
    url: string,
    {
        method,
        headers,
        params,
        body,
    }: {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        params?: any;
        body?: BodyInit;
        responseType?: string;
        headers?:{[k:string]:string}
    },
): Promise<T> => {
    let targetUrl = `${baseURL}${url}`;

    if (params) {
        targetUrl += '?' + new URLSearchParams(params);
    }

    const response = await fetch(targetUrl, {
        method,
        body,
        headers:{...headers, "Authorization":`Bearer ${token.value}`},
    });

    return response.json().then(json=>{return{
        data:json,
        status:response.status,
        headers:{...headers, "Authorization":`Bearer ${token.value}`}
    }});
};

export default fetchWithAuth;