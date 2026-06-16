import { Task } from "./task.interface";
import { User } from "./user.interface";

export interface Project{
    title:string,
    description:string,
    creator:string,
    members?:User[],
    tasks?:Task[],
    _id?:string,
    logs?:string[];
}