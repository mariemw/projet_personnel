import { Injectable } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';
import { Game } from 'src/interfaces/game.interface';
import { Player } from 'src/interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
    games:Game[]=[];

    findGame(player:Player){
        if(this.games.length===0){
            return this.createGame(player);
        }else{
            const game=this.games.find((g)=>g.isLocked===false);
            if(!game) return this.createGame(player);
            if(game.players[0].role===Role.Defender){
                player.role=Role.Hacker
            }else{
                player.role=Role.Defender;
            }
            game.players.push(player)
            if(game.players.length===2) game.isLocked=true;
            return game;
        }
    }

    createGame(player:Player){
        const gameId = uuidv4();
        this.giveRandomRole(player);
        const game={gameId,players:[player],isLocked:false};
        this.games.push(game);
        return game;
    }

    giveRandomRole(player:Player){
        const roles: Role[] = [Role.Hacker, Role.Defender];
        player.role=roles[Math.floor(Math.random()*roles.length)];
    }
}
