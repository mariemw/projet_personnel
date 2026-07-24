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
   const [attacker,setAttacker]=useState<player>()
   const [infrastructures,setInfrastructures]=useState<Infrastructure[]>([]);
   const [selectedInfra, setSelectedInfra] = useState<Infrastructure | null>(null);
   const [showActionMenu, setShowActionMenu] = useState(false);
   const minutes = Math.floor(time / 60);
   const seconds = time % 60;
   const [systemHealth,setSystemHealth]=useState(100);
   const handleDDos=()=>{
      if((attacker?.energy ?? 0) >= 3){
         setIsDDos(true);
      }
      
   }
   const handleRansomWare=()=>{
      if((attacker?.energy ?? 0) >= 5){
         socket.emit("RansomWareAction",game.gameId);
      }
   }
   const handleSurCharge=()=>{
      if((attacker?.energy ?? 0) >= 4){
         socket.emit("SurchargeElectric",game.gameId);
      }
   }
   const currentPlayer=game.players.find((p:player)=>p.socketId===socket.id);
   const isHacker=currentPlayer?.role==="hacker";
   const handleActionDDos=(infra:Infrastructure)=>{
      if((attacker?.energy ?? 0) >= 3){
         socket.emit("DDosAction",{gameId:game.gameId,infrastructure:infra.type});
         setIsDDos(false);
      }else{
         console.log("energie insuffisante")
      }
      
   }
   
   useEffect(()=>{
      console.log(attacker?.energy)
        socket.on("timerUpdate",(game)=>{
            setAttacker(game.players.find((p:player)=>p.role==="hacker"))
            setTime(game.timer);
            setSystemHealth(game.systemHealth);
            setInfrastructures(game.infrastructures);
        }) 
        socket.on("gameDDosUpdate",(game)=>{
         setInfrastructures(game.infrastructures);
         setSystemHealth(game.systemHealth)
         console.log("update infra")
        })
        socket.on("gameRansomWareUpdate",(game)=>{
         setInfrastructures(game.infrastructures);
         setAttacker(game.players.find((p:player)=>p.role==="hacker"))
         setSystemHealth(game.systemHealth)
         console.log("update infra")
        })
        socket.on("gameSurchargeUpdate",(game)=>{
         setInfrastructures(game.infrastructures);
         setSystemHealth(game.systemHealth)
        })
        return () => {
            socket.off("timerUpdate");
            socket.off("gameDDosUpdate");
         };
   },[])
   return(
      <div className="mission-container">

         <h1>
            ⚠️ La mission commence !
         </h1>

         <div className="build-card">
            {infrastructures?.map((infra,index)=>(
              
               <div className={((infra.type==="Base de données"||infra.type==="Générateur d'énergie"  )&& isDDos)|| infra.isBlocked?"infra-card disabled":"infra-card"}
                key={index}
                onClick={()=>{
                  if(isDDos && (infra.type==="Serveur Web"||infra.type==="Pare-feu")){
                     handleActionDDos(infra);
                  }

                  if(!isHacker){
                     setSelectedInfra(infra);
                     setShowActionMenu(true);
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
         { 
          isHacker && 
          <div className="action-card">
            <button className={isDDos?"btn active":"btn"} onClick={handleDDos}>DDos</button>
            <button className="btn" onClick={handleRansomWare}>RansomWare</button>
            <button className="btn" onClick={handleSurCharge}>Surcharge Électrique</button>
         </div>}

            {
               showActionMenu && selectedInfra && (
               <div className="menu-overlay">
                  <div className="action-menu">

                      <div className="menu-header">
                        <h2>{selectedInfra.type}</h2>
                        <p>Choisissez une action</p>
                     </div>

                     <button className="menu-btn repair"
                        // onClick={() => {
                        //    console.log("Réparer");
                        //    // socket.emit(...)
                        //    setShowActionMenu(false);
                        // }}
                     >
                        🔧 Réparer
                     </button>

                     <button className="menu-btn decrypt"
                        // onClick={() => {
                        //    console.log("Firewall");
                        //    // socket.emit(...)
                        //    setShowActionMenu(false);
                        // }}
                     >
                        Décryptage
                     </button>

                      <button className="menu-btn boost"
                        // onClick={() => {
                        //    console.log("Firewall");
                        //    // socket.emit(...)
                        //    setShowActionMenu(false);
                        // }}
                     >
                        Multiplicateur
                     </button>
                     

                     <button className="menu-btn restart"
                        // onClick={() => {
                        //    console.log("Analyser");
                        //    // socket.emit(...)
                        //    setShowActionMenu(false);
                        // }}
                     >
                        Redémarrage Système
                     </button>

                     <button className="close-btn"
                        onClick={() => {
                           setShowActionMenu(false);
                           setSelectedInfra(null);
                        }}
                     >
                        Fermer
                     </button>

                  </div>
               </div>
               )
            }
      </div>
      
   )
}