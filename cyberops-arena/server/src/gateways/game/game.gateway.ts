import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io"
import type { Game } from 'src/interfaces/game.interface';
import { GameService } from 'src/services/game/game.service';

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class GameGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private gameService:GameService){}

  handleConnection(client: Socket) {
    console.log("Client connecté :", client.id);
  }

  handleDisconnect(client: Socket) {
    console.log("Client déconnecté :", client.id);
  }

  @SubscribeMessage('joinGame')
  handleMessage(client:Socket,data:{playerId:string,name:string}) {
    console.log(data.playerId);
    const player={
        playerId:data.playerId,
        name:data.name
    };
    const game=this.gameService.findGame(player);
    console.log(game?.players.length,game.gameId);
    client.join(game.gameId);
    this.server.to(game.gameId).emit("gameJoined",game);
   
  }
  @SubscribeMessage('lockGame')
  handleLock(client:Socket,game:Game) {
    console.log("hanell")
    this.server.to(game.gameId).emit("gameLocked",game);
  }
}
