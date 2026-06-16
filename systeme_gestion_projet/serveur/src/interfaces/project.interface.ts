import { User } from "src/models/schema/user.schema";
import { Task } from "./task.interface";

export interface Project{
    title:string,
    description:string,
    creator:string,
    members:User[],
    tasks:Task[],
    logs?:string[];
}