import { Component, OnInit } from '@angular/core';
import { Game } from 'viewmodel/game';
import { GameService } from 'services/game.service';
import { NodeResponse } from 'viewmodel/nodeResponse';
import { GeneralService } from 'services/general.service';
import { NameValuePair } from 'viewmodel/name-value-pair';
import { Stats } from 'viewmodel/stats';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

    public searchPoints: string;
    public games: Game[];
    public numberFilesRead: number;
    public points: number[];
    public querySet: NameValuePair;
    public sets: NameValuePair[];
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
    public workInProgress: boolean;
    public showStats: boolean;
    public stats: Stats[];
    public totalCount: number;
    public totalCountWeight: number;
    public totalStats: any[];
    public totalCountWeightSum: number;
    public totalWeightSum: number;



    constructor(private gameService: GameService,
                private generalService: GeneralService) {}

    ngOnInit() {
        this.showStats = false;
        this.workInProgress = true;
        this.generalService.loadValuesForCountries().subscribe(
            res => {
                this.locations = new Array();
                res.forEach(element => {
                    this.locations.push({name: element, value: element !== '' ? element : null});
                });
                this.queryLocation = {name: '', value: null};
                this.workInProgress = false;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Cant find uniqye fields in DB...');
                this.workInProgress = false;
            }
        );

        this.initialize();
    }

    public readLocalDataFolder() {
        this.workInProgress = true;
        this.gameService.loadGamesFromDataFolder().subscribe(
            gameReadRes => {
                this.games = gameReadRes ? gameReadRes.list : [];
                this.numberFilesRead = gameReadRes.numberFiles;
                this.workInProgress = false;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
                this.workInProgress = false;
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
        this.workInProgress = true;
        this.gameService.uploadGamesToDB(this.games).subscribe(
            (res: NodeResponse) => {
                if (res.success) { console.log(res.message); }
                if (!res.success) { console.error(res.message); }
                this.workInProgress = false;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
                this.workInProgress = false;
            }
        );
    }

    public deleteGame() {
        this.workInProgress = true;
        this.gameService.deleteGamesFromDB('this.games').subscribe(
            (res: NodeResponse) => {
                if (res.success) { console.log(res.message); }
                this.workInProgress = false;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
                this.workInProgress = false;
            }
        );
    }

    public deleteAllGame() {
        this.workInProgress = true;
        this.gameService.deleteAllGamesFromDB().subscribe(
            gameReadRes => {
                this.games = gameReadRes ? gameReadRes.list : [];
                this.numberFilesRead = gameReadRes.numberFiles;
                this.workInProgress = false;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
                this.workInProgress = false;
            }
        );
    }

    public readDBGames() {
        this.workInProgress = true;
        this.gameService.loadGamesFromDB().subscribe(
            gameReadRes => {
                this.games = gameReadRes ? gameReadRes.list : [];
                this.numberFilesRead = gameReadRes.numberFiles;
                this.workInProgress = false;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
                this.workInProgress = false;
            }
        );
    }

    public searchDB() {
        this.workInProgress = true;
        this.clearScreen();
        if (this.homeQueryPoints !== null && this.awayQueryPoints !== null) {
            this.searchPoints = this.homeQueryPoints + ':' + this.awayQueryPoints;
        }
        this.gameService.findGames(
                this.homeQueryPoints, this.awayQueryPoints, this.querySet.value, this.queryLocation.value,
                this.gender.value, this.level.value
            ).subscribe(
            gameReadRes => {
                this.games = gameReadRes ? gameReadRes.list : [];
                this.numberFilesRead = gameReadRes.numberFiles;
                this.stats = gameReadRes.stats ? gameReadRes.stats : [];
                if (this.stats.length > 0) {
                    const obj = this.getTotalCount(this.stats);
                    this.totalCount = obj.totalCount;
                    this.totalCountWeight = obj.totalCountWeight;
                    this.totalStats = this.getTotalStats(this.stats);
                    this.totalStats = this.totalStats.sort( (a, b) => {
                        if (a.sum > b.sum) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });

                    const obj1 = this.getTotalCountWeightSum(this.totalStats);
                    this.totalCountWeightSum = obj1.total;
                    this.totalWeightSum = obj1.totalWeight;
                }else {
                    this.totalCount = 0;
                    this.totalCountWeight = 0;
                }
                this.workInProgress = false;
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText +
                '. Getting games from DB with conditions score search...');
                this.workInProgress = false;
            }
        );
    }

    public getSetsByGameId(id: string) {
        this.gameService.getStesFromDBByID(id).subscribe(
            res => {
                // not used, probably can be removed
            },
            err => {
                console.warn(err.url + ' - ' + err.status + ' ' + err.statusText + '. Reading from DATA folder error...');
            }
        );
    }

    public setBackground(points: string, prevPoints: string, position: number): boolean {
        if (!prevPoints) {
            if (position === 0) {
                return points === '1:0' ? true : false;
            }else {
                return points === '0:1' ? true : false;
            }
        }else {
            const p = points.split(':');
            const p_1 = prevPoints.split(':');

            const difHome = Number(p[0]) - Number(p_1[0]);
            const difAway = Number(p[1]) - Number(p_1[1]);
            if (position === 0) {
                return difHome > difAway ? true : false;
            }else {
                return difHome < difAway ? true : false;
            }
        }
    }

    public clearScreen(): void {
        this.games = null;
        this.numberFilesRead = null;
    }

    public round(value) {
        let line = 0;
        const int_part = Math.trunc(value);
        const float_part = Number((value - int_part).toFixed(2));
        if (float_part > 0 && float_part < 0.5) {
            line = int_part - 0.5;
        } else {
            line = int_part + 0.5;
        }
        return line;
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

        this.sets = new Array();
        this.sets.push({name: '', value: null});
        this.sets.push({name: 'I', value: '0'});
        this.sets.push({name: 'II', value: '1'});
        this.sets.push({name: 'III', value: '2'});
        this.sets.push({name: 'IV', value: '3'});
        this.sets.push({name: 'V', value: '4'});
        this.querySet = {name: '', value: null};

        this.points = new Array();
        for (let i = 0; i < 60; i++) {
            this.points.push(i);
        }
        this.points.unshift(null);
    }

    private getTotalCount(stats: Stats[]): any {
        let totalCount = 0;
        let totalCountWeight = 0;
        stats.forEach( (element: Stats) => {
            totalCount += element.count;
            totalCountWeight += element.count * element.dif;
        });
        return { totalCount: totalCount, totalCountWeight: totalCountWeight };
    }

    private getTotalStats(stats: Stats[]): any[] {
        const arrayKeys = [];
        const array = [];
        stats.forEach( (element: Stats) => {
            const res = element.result.split(':');
            const obj = {
                sum: 0,
                count: 0,
                weight: 0
            };
            if (arrayKeys.indexOf(parseInt(res[0], 10) + parseInt(res[1], 10)) === -1) {
                obj.sum = parseInt(res[0], 10) + parseInt(res[1], 10);
                obj.count += element.count;
                obj.weight = 0;
                arrayKeys.push(parseInt(res[0], 10) + parseInt(res[1], 10));
                array.push(obj);
            }else {
                const index = array.findIndex(x => x.sum === parseInt(res[0], 10) + parseInt(res[1], 10));
                array[index].count += element.count;
            }
        });

        array.forEach( element => {
            element.weight = element.count * element.sum;
        });

        return array;
    }

    private getTotalCountWeightSum(ts: any[]): any {
        const obj = {
            total: 0,
            totalWeight: 0
        };

        ts.forEach(element => {
            obj.total += element.weight;
            obj.totalWeight += element.weight * element.sum;
        });

        return obj;
    }
}
