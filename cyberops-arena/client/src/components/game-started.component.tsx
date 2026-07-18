import { useContext, useEffect, useState } from "react"
import { socket } from "../services/socket"
import "./game-started.component.css"
import type { Infrastructure } from "../interfaces/infrastructures.interface";
import { GameContext } from "../hooks/game-context";
import type { player } from "../interfaces/player.interface";

export default function GameStartedComponent(){
   const {game}=useContext(GameContext);
   const [time,setTime]=useState(180);
   const [isDDos, setIsDDos] = useState(false);
   const [infrastructures,setInfrastructures]=useState<Infrastructure[]>([]);
   //const [selectedInfrastructure,setSelectedInfrasturctuew]=useState<Infrastructure|null>(null);
   const minutes = Math.floor(time / 60);
   const seconds = time % 60;
   const [systemHealth,setSystemHealth]=useState(100);
   const handleDDos=()=>{
      setIsDDos(true);
   }
   const currentPlayer=game.players.find((p:player)=>p.socketId===socket.id);
   const isHacker=currentPlayer?.role==="hacker";
   const handleAction=(infra:Infrastructure)=>{
      socket.emit("DDosAction",{gameId:game.gameId,infrastructure:infra.type});
      setIsDDos(false);
   }
   useEffect(()=>{
        socket.on("timerUpdate",(game)=>{
            setTime(game.timer);
            setSystemHealth(game.systemHealth);
            setInfrastructures(game.infrastructures);
        }) 
        socket.on("gameDDosUpdate",(game)=>{
         setInfrastructures(game.infrastructures);
         setSystemHealth(game.systemHealth)
         console.log("update infra")
        })
   },[])
   return(
      <div className="mission-container">

         <h1>
            ⚠️ La mission commence !
         </h1>

         <div className="build-card">
            {infrastructures?.map((infra,index)=>(
              
               <div className={(infra.type==="Base de données"||infra.type==="Générateur d'énergie")&& isDDos?"infra-card disabled":"infra-card"}
                key={index}
                onClick={()=>{
                  if(isDDos && (infra.type==="Serveur Web"||"Pare-feu")){
                     handleAction(infra);
                  }
                }}
                >
                  
                  <h3>{infra.type}</h3>

                  <div className="mini-bar">
                  <div
                     className="mini-fill"
                     style={{ width: `${infra.health * 4}%` }}
                  ></div>
                  </div>

                  <span>{infra.health}/25</span>
               </div>
            ))}
         </div>
         <div className="timer-card">

            <span>Temps restant</span>

            <h2>
                  {minutes}:{seconds}
            </h2>

         </div>
         <div className="health-bar">
            <div
               className="health-fill"
               style={{ width: `${systemHealth}%` }}
            >{systemHealth}%</div>
         </div>
         <div className="action-card">
           {isHacker && <button className={isDDos?"btn active":"btn"} onClick={handleDDos}>DDos</button>}
            
         </div>

      </div>
   )
}