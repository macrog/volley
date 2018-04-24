import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';


import 'rxjs/add/operator/map';
import { HttpService } from 'services/http.service';
import { Observable } from 'rxjs/Observable';
import { ReadGameRes } from 'viewmodel/readGameRes';
import { Game } from 'viewmodel/game';
import { NodeResponse } from 'viewmodel/nodeResponse';

@Injectable()
export class GameService {

    private baseURL: String = 'http://localhost:3000/';

    constructor(private httpService: HttpService) {}

    public loadGamesFromDataFolder(): Observable<ReadGameRes> {
        let result: Observable<ReadGameRes>;

        result = this.httpService.getHttp(this.baseURL + 'game/read');

        return result;
    }

    public loadGamesFromDB(): Observable<ReadGameRes> {
        let result: Observable<ReadGameRes>;

        result = this.httpService.getHttp(this.baseURL + 'game/');

        return result;
    }

    public getStesFromDBByID(id: string): Observable<Number[][]> {
        let result: Observable<Number[][]>;

        result = this.httpService.getHttp(this.baseURL + 'game/sets/' + id);

        return result;
    }

    public uploadGamesToDB(games: Game[]): Observable<NodeResponse> {
        let result: Observable<NodeResponse>;
        result = this.httpService.postHttp(this.baseURL + 'game/upload', games);

        return result;
    }

    public deleteGamesFromDB(id: string): Observable<NodeResponse> {
        let result: Observable<NodeResponse>;
        result = this.httpService.deleteHttp(this.baseURL + 'game/delete/' + id);

        return result;
    }

    public deleteAllGamesFromDB(): Observable<ReadGameRes> {
        let result: Observable<ReadGameRes>;

        result = this.httpService.deleteHttp(this.baseURL + 'game/delete');

        return result;
    }

    public findGames(
            home: number = null, away: number = null, location: string = null,
            gender: string = null
        ): Observable<ReadGameRes> {
        let result: Observable<ReadGameRes>;
        const params: any = {};

        params.home = home;
        params.away = away;
        params.location = location;
        params.gender = gender;

        result = this.httpService.getHttp(`${this.baseURL}game/find/` + JSON.stringify(params));

        return result;
    }
}
