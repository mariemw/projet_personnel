import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/models/schema/message.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private messageModel:Model<MessageDocument>,
    ){}

    async getMessagesByProject(projectId:string){
        return await this.messageModel.find({projectId:projectId});
    }

    async addMessage(text:string,userId:string,projectId:string,userName:string){
        const newMessage=new this.messageModel({text,userId,projectId,userName});
        return await newMessage.save();
    }


}
