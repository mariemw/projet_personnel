import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import test from 'node:test';
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
          if(game.isDDosActive){
            const selectedInfrastructure=game.infrastructures.find((infra)=>(infra.ddosTimer!)>0);
            if(!selectedInfrastructure) return;
            if(selectedInfrastructure.ddosTimer??0>0){
              selectedInfrastructure.ddosTimer!--;
              selectedInfrastructure.health=Math.max(0, selectedInfrastructure.health-2);
              game.systemHealth = game.infrastructures.reduce(
                (total, infra) => total + infra.health,
                0
              );
              console.log(selectedInfrastructure.ddosTimer)
              this.server.to(game.gameId).emit("gameDDosUpdate",game);
            }else{
              game.isDDosActive = false;
              this.server.to(game.gameId).emit("gameDDosUpdate",game);
            }
          }
      }
    
    }, 1000);

  }

  @SubscribeMessage("DDosAction")
  handleDDos(client:Socket,data:{gameId:string,infrastructure:InfraType}){
    const game=this.gameService.getGame(data.gameId);
    game.isDDosActive=true;
    //let timeLeft=10;
    const selectedInfrastructure=game.infrastructures.find((infra)=>infra.type===data.infrastructure);
    if(!selectedInfrastructure) return;
    selectedInfrastructure.ddosTimer=10;
    const attacker=game.players.find((p)=>p.role==="hacker");
    if(!attacker) return;
    attacker.energy-=3;
    // const interval=setInterval(() => {
    //  if(timeLeft>0){
    //   timeLeft--;
    //   selectedInfrastructure.health=Math.max(0, selectedInfrastructure.health-2);
    //   game.systemHealth = game.infrastructures.reduce(
    //     (total, infra) => total + infra.health,
    //     0
    //   );
    //   this.server.to(game.gameId).emit("gameDDosUpdate",game);
    //  }else {
    //     clearInterval(interval);
    //     game.isDDosActive = false;
    //     this.server.to(game.gameId).emit("gameDDosUpdate",game);
    //  }
    // }, 1000);
    
  }

  @SubscribeMessage("RansomWareAction")
  handleRansomWare(client:Socket,gameId:string){
    const game=this.gameService.getGame(gameId);
    const dataBase=game.infrastructures.find((i)=>i.type===InfraType.DataBase);
    if(!dataBase) return;
    dataBase.isBlocked=true;
    const attacker=game.players.find((p)=>p.role==="hacker");
    if(!attacker) return;
    attacker.energy-=5;
    game.systemHealth-=25;
    this.server.to(game.gameId).emit("gameRansomWareUpdate",game);
  }

  @SubscribeMessage("SurchargeElectric")
  handleSurcharge(client:Socket,gameId:string){
    const game=this.gameService.getGame(gameId);
    const energizer=game.infrastructures.find((i)=>i.type===InfraType.Energizer);
    if(!energizer) return;
    // energizer.isBlocked=true;
    energizer.health=Math.max(0,energizer.health-((energizer.health*25)/100));
    game.systemHealth = game.infrastructures.reduce(
      (total, infra) => total + infra.health,
      0
    );
    this.server.to(game.gameId).emit("gameSurchargeUpdate",game);
  }

  @SubscribeMessage("reparation")
  handleReparation(client:Socket,data:{gameId:string,infra:InfraType}){
    const game=this.gameService.getGame(data.gameId);
    const selectedInfrastructure=game.infrastructures.find((infra)=>infra.type===data.infra);
    if(!selectedInfrastructure) return;
    selectedInfrastructure.health=Math.min(25,selectedInfrastructure.health+(selectedInfrastructure?.health*20)/100)
    game.systemHealth = game.infrastructures.reduce(
      (total, infra) => total + infra.health,
      0
    );
    this.server.to(game.gameId).emit("reparationUpdate",game);
  }

  @SubscribeMessage("decryptage")
  handleDecryptage(client:Socket,gameId:string){
    const game=this.gameService.getGame(gameId);
    const dataBase=game.infrastructures.find((i)=>i.type===InfraType.DataBase);
    if(!dataBase) return;
    dataBase.isBlocked=false;
    game.systemHealth+=25;
    this.server.to(game.gameId).emit("decryptageUpdate",game);
  }
}
