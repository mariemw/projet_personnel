import { Module } from '@nestjs/common';
import { GameGateway } from 'src/gateways/game/game.gateway';
import { GameService } from 'src/services/game/game.service';
import { TimerService } from 'src/services/timer/timer.service';

@Module({
    imports:[
        
    ],
    providers: [GameGateway,GameService,TimerService],
})
export class GameModule {}
