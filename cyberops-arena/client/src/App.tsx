import { useEffect } from 'react';
import './App.css'
import { socket } from './services/socket';
import JoinGameComponent from './components/join-game.component';
import image from "./assets/image.png";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WaitGameComponent from './components/wait-game.component';
import GameComponent from './components/game.component';
 
function App() {
  useEffect(() => {

        socket.connect();

        socket.on("connect", () => {
            console.log(socket.id);
        });

        return () => {
            socket.disconnect();
        };

    }, []);

  return (
    <BrowserRouter>
      <div
          className="app"
          style={{
            backgroundImage: `url(${image})`,
          }}
        >
          <Routes>
            <Route path='/' element={ <JoinGameComponent/>}></Route>
            <Route path='/wait' element={ <WaitGameComponent/>}></Route>
            <Route path='/game/:gameId' element={ <GameComponent/>}></Route>
          </Routes>
         
      </div>
    </BrowserRouter>
      
  )
}

export default App
