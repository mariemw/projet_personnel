import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Task } from "src/interfaces/task.interface";
import type { User } from "src/interfaces/user.interface";

export class UpdateProjectDto{
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    title:string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    description:string;

}