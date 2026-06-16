import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket , Server} from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProjectGateway {
  
  @SubscribeMessage('joinProject')
  handleJoinProject(@ConnectedSocket() client:Socket,@MessageBody() projectId:string){
    client.join(projectId);
  }
  
}
