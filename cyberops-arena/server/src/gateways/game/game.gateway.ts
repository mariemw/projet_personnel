import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io"
import { InfraType } from 'src/enums/infraType.enum';
import type { Game } from 'src/interfaces/game.interface';
import { Infrastructure } from 'src/interfaces/infrastructure.interface';
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
        socketId:client.id,
        name:data.name,
        energy:0
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
  handleStart(client:Socket,gameId:string){
    const game=this.gameService.getGame(gameId);
    this.server.to(game.gameId).emit("gameStarted");
    let timeLeft=180;
    setInterval(() => {
      if(timeLeft>0){
          timeLeft--;
          game.players.forEach((p)=>{
            if(p.energy<15){
              p.energy++;
            }
      
          });
          game.timer=timeLeft;
          this.server.to(game?.gameId).emit("timerUpdate",game);
      }
    
    }, 1000);

  }

  @SubscribeMessage("DDosAction")
  handleDDos(client:Socket,data:{gameId:string,infrastructure:InfraType}){
    const game=this.gameService.getGame(data.gameId);
    let timeLeft=10;
    // const firewall=game.infrastructures.find((infra)=>infra.type===InfraType.FireWall);
    // const server=game.infrastructures.find((infra)=>infra.type===InfraType.Server);
    const selectedInfrastructure=game.infrastructures.find((infra)=>infra.type===data.infrastructure);
    if(!selectedInfrastructure) return;
    setInterval(() => {
     if(timeLeft>0){
      timeLeft--;
      // firewall.health=Math.max(0, firewall.health-2);
      // server.health=Math.max(0, server.health-2);
      selectedInfrastructure.health=Math.max(0, selectedInfrastructure.health-2);
      game.systemHealth = game.infrastructures.reduce(
        (total, infra) => total + infra.health,
        0
      );
      this.server.to(game.gameId).emit("gameDDosUpdate",game);
     }
    }, 1000);
    
  }
}
