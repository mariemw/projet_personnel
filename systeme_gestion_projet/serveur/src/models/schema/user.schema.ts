import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Project } from "src/interfaces/project.interface";

export type UserDocument = User & Document;

@Schema( { timestamps: true })
export class User{
    @Prop({required:true})
    userName:string;

    @Prop({required:true})
    password:string;

    @Prop({required:true})
    email:string;

    @Prop({default:false,required:true})
    isVerified:boolean;

    @Prop({required:false})
    verificationToken:string;

    @Prop({required:false})
    tokenExpiredAt:Date


}

export const UserSchema=SchemaFactory.createForClass(User);