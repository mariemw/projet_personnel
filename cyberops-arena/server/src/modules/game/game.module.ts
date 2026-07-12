import { Module } from '@nestjs/common';
import { GameGateway } from 'src/gateways/game/game.gateway';
import { GameService } from 'src/services/game/game.service';

@Module({
    imports:[
        
    ],
    providers: [GameGateway,GameService],
})
export class GameModule {}
