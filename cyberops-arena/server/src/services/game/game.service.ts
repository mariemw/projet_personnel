import { Injectable } from '@nestjs/common';
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
            game.players.push(player)
            if(game.players.length===2) game.isLocked=true;
            return game;
        }
    }

    createGame(player:Player){
        const gameId = uuidv4();
        const game={gameId,players:[player],isLocked:false};
        this.games.push(game);
        return game;
    }
}
