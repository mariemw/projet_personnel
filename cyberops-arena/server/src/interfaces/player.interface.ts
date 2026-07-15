import { Role } from "src/enums/role.enum";

export interface Player{
    playerId:string,
    name:string,
    role?:Role
}