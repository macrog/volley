import { Component, OnInit } from '@angular/core';
import { Game } from 'viewmodel/game';
import { GameService } from 'services/game.service';
import { NodeResponse } from 'viewmodel/nodeResponse';
import { GeneralService } from 'services/general.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

    public title = 'app works!';
    public games: Game[];
    public numberFilesRead: number;
    public points: number[];
    public homeQuerryPoints: number;
    public awayQuerryPoints: number;

    constructor(private gameService: GameService,
                private generalService: GeneralService) {}

    ngOnInit() {

        this.generalService.loadValuesForCountries().subscribe(
            res => {
                debugger;
                //this is data for dropdown for locations
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Cant find uniqye fields in DB...');
            }
        );
        this.points = new Array();
        for(let i = 0; i < 60; i++){
            this.points.push(i);
        }
    }

    public readLocalDataFolder() {
        this.gameService.loadGamesFromDataFolder().subscribe(
            gameReadRes => {
                this.games = gameReadRes ? gameReadRes.list : [];
                this.numberFilesRead = gameReadRes.numberFiles;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
            }
        );
    }

    public getSetPoints(position: number, setPoints: string[]): string{
        const lastPoints = setPoints[setPoints.length - 1].split(' : ');
        return lastPoints[position];
    }

    public getPoint(currentPoints: string, prevPoints: string, position: number): string{
        if(prevPoints){
            let currentPointsSplit = currentPoints.split(' : ');
            let prevPointsSplit = prevPoints.split(' : ');

            return position === 0 ? currentPointsSplit[0] > prevPointsSplit[0] ? 'red' : '' : currentPointsSplit[1] > prevPointsSplit[1] ? 'red' : '';

        }else{
            return currentPoints.split(' : ')[0] > currentPoints.split(' : ')[1] ? 'red' : '';
        }
    }

    public uploadGamesToDB(){
        this.gameService.uploadGamesToDB(this.games).subscribe(
            (res: NodeResponse) => {
                if(res.success) console.log(res.message);
                if(!res.success) console.error(res.message);
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
            }
        );
    }

    public deleteGame(){
        this.gameService.deleteGamesFromDB('this.games').subscribe(
            
            (res: NodeResponse) => {
                debugger;
                if(res.success) console.log(res.message);
            },
            err => {
                debugger;
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
            }
        );
    }

    public deleteAllGame(){
        this.gameService.deleteAllGamesFromDB().subscribe(
            gameReadRes => {
                this.games = gameReadRes ? gameReadRes.list : [];
                this.numberFilesRead = gameReadRes.numberFiles;
        },
        err => {
            console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
        });
    }

    public readDBGames() {
        this.gameService.loadGamesFromDB().subscribe(
            gameReadRes => {
                this.games = gameReadRes ? gameReadRes.list : [];
                this.numberFilesRead = gameReadRes.numberFiles;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
            }
        );
    }

    public searchDBForScore(){
        debugger;
        this.gameService.findGames(this.homeQuerryPoints, this.awayQuerryPoints).subscribe(
            gameReadRes => {
                this.games = gameReadRes ? gameReadRes.list : [];
                this.numberFilesRead = gameReadRes.numberFiles;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Getting games from DB with conditions score search...');
            }
        );
    }

    public getSetsByGameId(id: string) {
        this.gameService.getStesFromDBByID(id).subscribe(
            res => {
                debugger;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
            }
        );
    }

    public clearScreen(): void {
        this.games = null;
        this.numberFilesRead = null;
    }
}
