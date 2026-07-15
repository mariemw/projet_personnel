import { useContext, useEffect } from "react";
import { socket } from "../services/socket";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../hooks/game-context";
import "./wait-game.component.css"

export default function WaitGameComponent(){
    const navigate = useNavigate();
    const { setGame } = useContext(GameContext);
     useEffect(()=>{
            socket.on("gameLocked",(game)=>{
                setGame(game);
                navigate(`/game/${game.gameId}`);
            })
            
            return()=>{
                socket.off("gameLocked")
            }
        },[navigate])
    return(
        <div className="wait-page">
            <div className="wait-card">
                <h1>Connexion au centre des opérations</h1>

                

                <p className="status">
                    Recherche d'un agent disponible...
                </p>
                <div className="loader"></div>
            </div>
        </div>
    )
   
}