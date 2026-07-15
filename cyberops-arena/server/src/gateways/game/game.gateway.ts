import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io"
import type { Game } from 'src/interfaces/game.interface';
import { Player } from 'src/interfaces/player.interface';
import { GameService } from 'src/services/game/game.service';
import { TimerService } from 'src/services/timer/timer.service';

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class GameGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private gameService:GameService,private timerService:TimerService){}

  handleConnection(client: Socket) {
    console.log("Client connecté :", client.id);
  }

  handleDisconnect(client: Socket) {
    console.log("Client déconnecté :", client.id);
  }

  @SubscribeMessage('joinGame')
  handleJoin(client:Socket,data:{playerId:string,name:string}) {
    console.log(data.playerId);
    const player:Player={
        playerId:data.playerId,
        name:data.name
    };
    const game=this.gameService.findGame(player);
    console.log(game?.players.length,game.gameId);
    console.log(player.role);
    client.join(game.gameId);
    this.server.to(game.gameId).emit("gameJoined",game);
   
  }
  @SubscribeMessage('lockGame')
  handleLock(client:Socket,game:Game) {
    this.server.to(game.gameId).emit("gameLocked",game);
  }

  @SubscribeMessage("startGame")
  handleStart(client:Socket,game:Game){
    this.server.to(game.gameId).emit("gameStarted");
    let timeLeft=180;
    setInterval(() => {
      console.log("seconde s'ecoule");
      if(timeLeft>0){
          timeLeft--;
          this.server.to(game.gameId).emit("timerUpdate",timeLeft);
      }
    
    }, 1000);

  }
}
