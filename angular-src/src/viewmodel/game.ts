export class Game {
    public location: string;
    public leaugue: string;
    public team1Name: string;
    public team2Name: string;
    public team1Set: number;
    public team2Set: number;
    public team1Points: number;
    public team2Points: number;
    public team1Aces: number;
    public team2Aces: number;
    public team1Kills: number;
    public team2Kills: number;
    public team1Blocks: number;
    public team2Blocks: number;
    public team1ServiceErrors: number;
    public team2ServiceErrors: number;
    public sets: string[][];
    public setsFinal: string[];
    public isMale: boolean;
    public isSenior: boolean;

    // db variable
    public _id?: string;

    //frontend flag
    public showSets: boolean;
}
