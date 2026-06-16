import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Task } from "src/interfaces/task.interface";
import type { User } from "src/interfaces/user.interface";
import { UserSchema } from "./user.schema";

export type ProjectDocument=Project & Document;

@Schema({timestamps: true})
export class Project{
    @Prop({required:true})
    title:string;

    @Prop({required:true})
    description:string;

    @Prop({required:true})
    creator:string;

    @Prop({type: [UserSchema],default: []})
    members:User[];

    @Prop({default:[]})
    tasks:Task[];

    @Prop({default:[]})
    logs:string[];

}

export const ProjectSchema=SchemaFactory.createForClass(Project);