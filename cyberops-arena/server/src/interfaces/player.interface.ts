import { Role } from "src/enums/role.enum";

export interface Player{
    playerId:string,
    socketId:string,
    name:string,
    role?:Role,
    energy:number,
    maxEnergy?:number
}