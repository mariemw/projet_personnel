import { useEffect, useState } from "react"
import { socket } from "../services/socket"
import "./game-started.component.css"

export default function GameStartedComponent(){
   const [time,setTime]=useState(180);
   const minutes = Math.floor(time / 60);
   const seconds = time % 60;
   useEffect(()=>{
        socket.on("timerUpdate",(timeLeft)=>{
            setTime(timeLeft);
        }) 
   },[])
   return(
      <div className="mission-container">

         <h1>
            ⚠️ La mission commence !
         </h1>


         <div className="timer-card">

            <span>Temps restant</span>

            <h2>
                  {minutes}:{seconds}
            </h2>

         </div>

      </div>
   )
}