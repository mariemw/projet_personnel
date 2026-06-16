import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from 'src/gateways/chat/chat.gateway';
import { Message, MessageSchema } from 'src/models/schema/message.schema';
import { MessageService } from 'src/services/message/message.service';


@Module({
     imports:[
        MongooseModule.forFeature([{name:Message.name,schema:MessageSchema}]),
    ],
    providers: [ChatGateway,MessageService],
})
export class ChatModule {}
