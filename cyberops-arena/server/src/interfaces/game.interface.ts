import { Status } from "src/enums/status.enum";
import { Infrastructure } from "./infrastructure.interface";
import { Player } from "./player.interface";

export interface Game{
    gameId:string,
    players:Player[],
    isLocked:boolean,
    timer?:number,
    infrastructures:Infrastructure[];
    status?:Status,
    systemHealth:number,
}