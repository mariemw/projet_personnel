import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type MessageDocument=Message & Document;

@Schema({timestamps: true})
export class Message{
    @Prop()
    text:string;

    @Prop()
    userId:string;

    @Prop()
    projectId:string;

    @Prop()
    userName:string;

}

export const MessageSchema=SchemaFactory.createForClass(Message);