import { useEffect } from "react";
import { socket } from "../services/socket";
import { useNavigate } from "react-router-dom";

export default function WaitGameComponent(){
    const navigate = useNavigate();
     useEffect(()=>{
            socket.on("gameLocked",(game)=>{
                console.log("wfeqw");
                navigate(`/game/${game.gameId}`);
            })
            
            return()=>{
                socket.off("gameLocked")
            }
        },[navigate])
    return(
        <>
        <h1>En attente d'un joueur...</h1>
        </>
    )
   
}