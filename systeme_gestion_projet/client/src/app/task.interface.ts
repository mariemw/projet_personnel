import { STATUS } from "./status.enum";

export interface Task{
    id?:string,
    title:string,
    description:string,
    status?:STATUS,
    deadline?:Date
}