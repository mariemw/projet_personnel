export interface player{
    playerId:string,
    name:string,
    role?:Role,
    avatar?:string
}

type Role = "defender" | "hacker";