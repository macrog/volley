import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';


import 'rxjs/add/operator/map';
import { HttpService } from 'services/http.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeneralService {

    private baseURL: String = 'http://localhost:3000/';

    constructor(private httpService: HttpService) {}

    public loadValuesForCountries(): Observable<string[]> {
        let result: Observable<string[]>;

        result = this.httpService.getHttp(`${this.baseURL}general/country`);

        return result;
    }

    public loadValuesForLEagues(location: string): Observable<string[]> {
        let result: Observable<string[]>;

        result = this.httpService.getHttp(`${this.baseURL}general/league/` + location);

        return result;
    }

}
