import type { player } from "./player.interface";


export interface Game{
    gameId:string,
    players:player[],
    isLocked:boolean,
    isDDosActive?:boolean
}