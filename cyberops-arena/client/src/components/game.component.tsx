import { useContext, useEffect } from "react"
import { GameContext } from "../hooks/game-context"
import type { player } from "../interfaces/player.interface";
import PlayerCard from "./player-card.component";
import "./game.component.css"
import { socket } from "../services/socket";
import { useNavigate } from "react-router-dom";


export default function GameComponent(){
    const {game}=useContext(GameContext)
    const navigate=useNavigate();
    const players:player[]=game?.players??[];
    const handleStartGame=()=>{
        socket.emit("startGame",game.gameId);
    }
    useEffect(()=>{
        socket.on("gameStarted",()=>{
            navigate(`/game-started/${game.gameId}`)
        });
    },[navigate,game])
    return(
        <div className="game-page"> 

            <h1>Bienvenue au jeu</h1>
            <section className="player-section">
                <h2>Agents connectés</h2>
                <div className="players-container">

                        {
                            players.map((p)=>(
                                <PlayerCard 
                                    key={p.playerId}
                                    player={p}
                                />
                            ))
                        }

                </div>
                
                
            </section>
            <button className="start-button" onClick={handleStartGame}>Commencer la mission</button>
       
        </div>
    )
   
}