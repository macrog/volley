import { Game } from 'viewmodel/game';
import { Stats } from 'viewmodel/stats';

export class ReadGameRes{
    public list: Game[];
    public numberFiles: number;
    public stats?: Stats[];
}