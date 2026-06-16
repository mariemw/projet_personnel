import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket , Server} from 'socket.io';
import { MessageService } from 'src/services/message/message.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server!:Server;

  constructor(private messageService:MessageService){}
  handleConnection(client: Socket) {
    
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data:{messageSent:string,projectId:string,userId:string,userName:string},@ConnectedSocket() socket:Socket){
    
    await this.messageService.addMessage(data.messageSent,data.userId,data.projectId,data.userName);
    this.server.to(data.projectId).except(socket.id).emit('receivedMessage', {
      messageSent: data.messageSent,
      userId: data.userId,
      userName: data.userName,
      projectId: data.projectId,
  
    });
  }


  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @MessageBody() projectId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const messages =await this.messageService.getMessagesByProject(projectId);
    socket.emit('messagesHistory', messages);
  }
}
