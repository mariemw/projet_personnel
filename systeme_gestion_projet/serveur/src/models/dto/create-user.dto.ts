import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    userName:string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(25)
    password:string;

    @IsNotEmpty()
    @IsString()
    email:string;

}