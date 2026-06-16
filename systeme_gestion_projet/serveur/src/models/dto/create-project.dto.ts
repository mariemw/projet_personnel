import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import type { User } from "src/interfaces/user.interface";

export class CreateProjectDto{
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    title:string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    description:string;

    @IsNotEmpty()
    creator:string;
}