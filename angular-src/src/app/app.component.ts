import { Component, OnInit } from '@angular/core';
import { Game } from 'viewmodel/game';
import { GameService } from 'services/game.service';
import { NodeResponse } from 'viewmodel/nodeResponse';
import { GeneralService } from 'services/general.service';
import { NameValuePair } from 'viewmodel/name-value-pair';

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
    public homeQueryPoints: number;
    public awayQueryPoints: number;
    public queryLocation: NameValuePair;
    public locations: NameValuePair[];
    public technichalBreak: NameValuePair;
    public breaks: NameValuePair[];
    public gender: NameValuePair;
    public genders: NameValuePair[];
    public level: NameValuePair;
    public levels: NameValuePair[];


    constructor(private gameService: GameService,
                private generalService: GeneralService) {}

    ngOnInit() {

        this.generalService.loadValuesForCountries().subscribe(
            res => {
                this.locations = new Array();
                res.forEach(element => {
                    this.locations.push({name: element, value: element !== '' ? element : null});
                });
                this.queryLocation = {name: '', value: null};
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Cant find uniqye fields in DB...');
            }
        );

        this.initialize();
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

    public getSetPoints(position: number, setPoints: string[]): string {
        const lastPoints = setPoints[setPoints.length - 1].split(' : ');
        return lastPoints[position];
    }

    public getPoint(currentPoints: string, prevPoints: string, position: number): string {
        if (prevPoints) {
            const currentPointsSplit = currentPoints.split(' : ');
            const prevPointsSplit = prevPoints.split(' : ');

            return position === 0 ? currentPointsSplit[0] > prevPointsSplit[0] ?
            'red' : '' : currentPointsSplit[1] > prevPointsSplit[1] ? 'red' : '';

        }else {
            return currentPoints.split(' : ')[0] > currentPoints.split(' : ')[1] ? 'red' : '';
        }
    }

    public uploadGamesToDB() {
        this.gameService.uploadGamesToDB(this.games).subscribe(
            (res: NodeResponse) => {
                if (res.success) { console.log(res.message); }
                if (!res.success) { console.error(res.message); }
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
            }
        );
    }

    public deleteGame() {
        this.gameService.deleteGamesFromDB('this.games').subscribe(
            (res: NodeResponse) => {
                if (res.success) { console.log(res.message); }
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
            }
        );
    }

    public deleteAllGame() {
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

    public searchDB() {
        this.gameService.findGames(
                this.homeQueryPoints, this.awayQueryPoints, this.queryLocation.value,
                this.gender.value, this.level.value
            ).subscribe(
            gameReadRes => {
                this.games = gameReadRes ? gameReadRes.list : [];
                this.numberFilesRead = gameReadRes.numberFiles;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText +
                '. Getting games from DB with conditions score search...');
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

    // --------------------------------PRIVATE MEMBERS--------------------------------------------- //
    private initialize(): void {
        this.breaks = new Array();
        this.breaks.push({name: '', value: null});
        this.breaks.push({name: '1st break', value: '1st'});
        this.breaks.push({name: '2nd break', value: '2nd'});
        this.technichalBreak = {name: '', value: null};

        this.genders = new Array();
        this.genders.push({name: '', value: null});
        this.genders.push({name: 'man', value: 'M'});
        this.genders.push({name: 'woman', value: 'W'});
        this.gender = {name: '', value: null};

        this.levels = new Array();
        this.levels.push({name: '', value: null});
        this.levels.push({name: 'junior', value: 'J'});
        this.levels.push({name: 'senior', value: 'S'});
        this.level = {name: '', value: null};

        this.points = new Array();
        for (let i = 0; i < 60; i++) {
            this.points.push(i);
        }
        this.points.unshift(null);
    }
}
