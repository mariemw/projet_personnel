export interface player{
    playerId:string,
    socketId:string,
    name:string,
    role?:Role,
    avatar?:string,
    energy?:number
}

type Role = "defender" | "hacker";