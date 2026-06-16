import { STATUS } from "src/enums/status.enum";

export interface Task{
    id:string,
    title:string,
    description:string,
    status:STATUS,
    deadline?:Date
}