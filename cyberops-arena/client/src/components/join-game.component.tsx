import { useEffect, useState } from "react";
import { socket } from "../services/socket"
import { v4 as uuidv4 } from "uuid";
import "./join-game.component.css";
import {  useNavigate } from "react-router-dom";


export default function JoinGameComponent(){
    
    const navigate = useNavigate();
    useEffect(()=>{
        socket.on("gameJoined",(game)=>{
            if(game.players.length===1){
                console.log("game unlocked")
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
        console.log(playerId)
        socket.emit("joinGame",{playerId,name})
        console.log("hiii")
    }
    const [playerId] = useState(uuidv4());
    const [name, setName] = useState('');
    const handleChange = (event:any) => {
        setName(event.target.value); 
    };
    
    return (
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
       
    )
}