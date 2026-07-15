import { createContext, useState } from "react";
import type { Game } from "../interfaces/game.interface";

export const GameContext=createContext<any>(null);

export function GameProvider({children}:any){
    const [game,setGame]=useState<Game|null>(null);
    return(
        <GameContext.Provider value={{game,setGame}}>
            {children}
        </GameContext.Provider>
    )
}