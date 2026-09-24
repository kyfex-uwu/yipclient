import {token} from "./index.js";

const baseURL = 'https://api.barq.app'; // use your own URL or environment variable

export const fetchWithAuth = async <T>(
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

    return response.json();
};

export default fetchWithAuth;