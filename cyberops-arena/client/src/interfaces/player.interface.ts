export interface player{
    playerId:string,
    socketId:string,
    name:string,
    role?:Role,
    avatar?:string
}

type Role = "defender" | "hacker";