import axios, { AxiosHeaders, AxiosRequestHeaders, RawAxiosRequestHeaders } from "axios";
import { Readable } from 'node:stream';

class HttpService{
    async downloadAsStream(url:string,headers?:RawAxiosRequestHeaders):Promise<Readable|null>{
        try {
            const response = await axios.get(
                url,
                {
                    responseType:'stream',
                    headers:headers
                    // headers: {
                    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                    //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    //     'Accept-Language': 'en-US,en;q=0.5',
                    //     'DNT': '1',
                    //     'Connection': 'keep-alive',
                    //     'Upgrade-Insecure-Requests': '1',
                    //     'Cookie': '_ga=GA1.1.1294945875.1749688914; _ga_CSLL4ZEK4L=GS2.1.s1749827130$o2$g0$t1749827145$j45$l0$h0; _ga_B59RVWNH5N=GS2.1.s1749827130$o2$g0$t1749827145$j45$l0$h0'
                    // }
                }
            );
            return response.data;
        } catch (error) {
            return null;
        }
    }
}

export default new HttpService();