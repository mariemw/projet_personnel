import { Injectable } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';

@Injectable()
export class TimerService {
    // private readonly GAME_DURATION = 180000;
    // // Stocke le temps restant pour chaque partie (Utile pour les requêtes des joueurs)
    // private activeGamesTime = new Map<string, number>(); 

    constructor(private schedulerRegistry:SchedulerRegistry){}

    startGame(gameId:string,timeLeft:number){
        //trouver la partie
        // créer un compteur
        // diminuer le temps
        console.log("game started"+gameId);
        // this.activeGamesTime.set(gameId,180);
        // const timeoutName = `game_end_${gameId}`;
        // const intervalName = `game_tick_${gameId}`;
        // // A. Le Timeout : Arrête le jeu à la fin des 180s
        // const gameTimeout = setTimeout(() => {
        //     this.endGame(gameId);
        // }, this.GAME_DURATION);

        // B. L'Interval : Décompte chaque seconde (pour l'affichage ou les sockets)
        setInterval(() => {//s'execute chaque seconde 1000
            // const timeLeft = this.activeGamesTime.get(gameId) || 0;
            // if (timeLeft > 0) {
            //     this.activeGamesTime.set(gameId, timeLeft - 1);
            //     // ICI : Vous pouvez envoyer "timeLeft - 1" à vos joueurs via WebSocket
            //     // this.gameGateway.broadcastTimeLeft(gameId, timeLeft - 1);
            // }
            
            console.log("seconde s'ecoule");
            if(timeLeft>0){
                // this.activeGamesTime.set(gameId,timeLeft-1);
                timeLeft--;
                console.log(timeLeft)
            }
            
        }, 1000);

        // // Enregistrement dans NestJS
        // this.schedulerRegistry.addTimeout(timeoutName, gameTimeout);
        // this.schedulerRegistry.addInterval(intervalName, gameInterval);
    }


    // // 2. LES JOUEURS PEUVENT JOUER SANS RESTRICTION ICI
    // playerAction(gameId: string, playerId: string, move: any) {
    //     // Vérifier si la partie est toujours en cours
    //     if (!this.activeGamesTime.has(gameId)) {
    //     throw new Error("La partie est terminée ou n'existe pas !");
    //     }

    //     console.log(`Joueur ${playerId} a fait une action dans la partie ${gameId}`);
    //     // Appliquez votre logique de jeu ici (score, position, etc.)
    // }

    // 3. FIN AUTOMATIQUE DU JEU (Appelé après 180s)
    // private endGame(gameId: string) {
    //     console.warn(`Temps écoulé ! Fin de la partie ${gameId}.`);

    //     // Calculer les scores, déclarer le gagnant...
    //     this.cleanGameTimers(gameId);
    //     this.activeGamesTime.delete(gameId);
    // }

    // // 4. NETTOYAGE (Important si la partie est quittée avant les 180s)
    // private cleanGameTimers(gameId: string) {
    //     const timeoutName = `game_end_${gameId}`;
    //     const intervalName = `game_tick_${gameId}`;

    //     // Nettoyer le Timeout
    //     try {
    //         if (this.schedulerRegistry.doesExist('timeout', timeoutName)) {
    //             clearTimeout(this.schedulerRegistry.getTimeout(timeoutName));
    //             this.schedulerRegistry.deleteTimeout(timeoutName);
    //         }
    //         } catch (e) {}

    //         // Nettoyer l'Interval
    //         try {
    //         if (this.schedulerRegistry.doesExist('interval', intervalName)) {
    //             clearInterval(this.schedulerRegistry.getInterval(intervalName));
    //             this.schedulerRegistry.deleteInterval(intervalName);
    //         }
    //     } catch (e) {}
    // }

}
