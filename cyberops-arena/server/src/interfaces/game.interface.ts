import { Player } from "./player.interface";

export interface Game{
    gameId:string,
    players:Player[],
    isLocked:boolean
}