import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';


import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {

    constructor(private http: Http) {}

    getHttp(url: string) {
        return this.http.get(url, {headers: this.getHeaders()})
                            .map((res: Response) => res.json());
    }

    postHttp(url: string, body: any) {
        return this.http.post(url, JSON.stringify(body), {headers: this.getHeaders('post')})
                            .map((res: Response) => res.json());
    }

    putHttp (url: any, body: any) {
        return this.http.put(url, JSON.stringify(body), {headers: this.getHeaders('put')})
                            .map((res: Response) => res === null ? null : res.json());
    }

    deleteHttp (url: any, body: any = '') {
        // In the delete call, using RequestOptions is the way of sending a body
        return this.http.delete(url, new RequestOptions({body: JSON.stringify(body)}))
                            .map((res: Response) => res.json());
    }

    private getHeaders(action: string = null) {
        const headers = new Headers();

        headers.append('Accept', 'application/json');
        headers.append('Cache-Control', 'no-cache');
        headers.append('Pragma', 'no-cache'); // For internet explorer/older versions of IIS

        if (action === 'post' || action === 'put') {
            headers.append('Content-Type', 'application/json');
        }

        return headers;
    }

}
