import { useContext, useEffect, useState } from "react";
import { socket } from "../services/socket"
import { v4 as uuidv4 } from "uuid";
import "./join-game.component.css";
import {  useNavigate } from "react-router-dom";
import { GameContext } from "../hooks/game-context";


export default function JoinGameComponent(){
    const { setGame } = useContext(GameContext);
    const navigate = useNavigate();
    useEffect(()=>{
        socket.on("gameJoined",(game)=>{
            setGame(game);
            if(game.players.length===1){
                navigate(`/wait`);
            }else{
                socket.emit("lockGame",game)
                navigate(`/game/${game.gameId}`);
            }
            
        })
        
        return()=>{
            socket.off("gameJoined")
        }
    },[navigate])
    const handleClick=()=>{
        socket.emit("joinGame",{playerId,name})  
    }
    const [playerId] = useState(uuidv4());
    const [name, setName] = useState('');
    const handleChange = (event:any) => {
        setName(event.target.value); 
    };
    
    return (
        <div className="join-page">
             <div className="join-card">
                <h1>CYBEROPS ARENA</h1>
                <p className="subtitle">Entrez votre nom et rejoignez une partie</p>
                <input  className="join-input"
                    type="text" 
                    placeholder="Nom de l'agent"
                    value={name}
                    onChange={handleChange} 
                />
                <button className="join-button" onClick={handleClick}
                        disabled={!name.trim()}
                >Rejoindre une partie</button>
            
            </div>
        </div>
       
       
    )
}