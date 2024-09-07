import express from 'express'
import { createServer } from 'node:http';
 import {Server} from 'socket.io'
import cors from 'cors'
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
const server = createServer(app)
const io = new Server(server,{
    cors:{
    origin:"https://hang-man-word-guessing-game.onrender.com/"
    }
});
let waitingPlayerToGuess=[];
let waitingPlayerToLetOneGuess=[];
let type=''
const activeInGame={};
io.on('connection', (socket) => {
 if(socket.handshake.auth.token=="guess"){
  waitingPlayerToGuess.push(socket.id)
 }else if(socket.handshake.auth.token=="letGuess"){
  waitingPlayerToLetOneGuess.push(socket.id)
 }else{
  //Play with computer
 }
    if(waitingPlayerToLetOneGuess.length>=1 &&   socket.handshake.auth.token == "guess"){
      //remove two users from waiting list;
        const playerOne=socket.id;
        const index= waitingPlayerToGuess.indexOf(playerOne)
        waitingPlayerToGuess.splice(index,1);
        const playerTwo=waitingPlayerToLetOneGuess.shift();
        //Create unique room id for two users
        const roomID=playerOne+playerTwo;
        io.to(playerOne).socketsJoin(roomID);
        io.to(playerTwo).socketsJoin(roomID);
        activeInGame[roomID]=[playerOne,playerTwo];
        io.to(roomID).emit("matched",roomID); 

    }else if(waitingPlayerToGuess.length>=1 &&  socket.handshake.auth.token == "letGuess"){
       //remove  current user from waiting list
       const playerOne=socket.id;
      const index= waitingPlayerToLetOneGuess.indexOf(playerOne)
      waitingPlayerToLetOneGuess.splice(index,1); 
     const playerTwo=waitingPlayerToGuess.shift();  
     //Create unique room id for two users
      const roomID=playerOne+playerTwo;
      //Creating unique room for two users
      io.to(playerOne).socketsJoin(roomID);
      io.to(playerTwo).socketsJoin(roomID);
      // add them to activeGame Objcet
      activeInGame[roomID]=[playerOne,playerTwo];
      //notify them that they are both connected in a same room
      io.to(roomID).emit("matched",roomID);
      
    }
    else{
      // Notify client if no waiting players for loading screen
        socket.emit("waitingForOpponet",true)
    } 
      // Exchange massages in the room
    socket.on("massage",(data)=>{
      //data[1] is roomID came from client
     //data[0] is user massage text
       io.to(data[1]).emit("keyPressed",data[0]);
     })   
  socket.on('hint',(data)=>{
    io.to(data[1]).emit("getHint",data[0]);
  })
  socket.on('word',(data)=>{
    io.to(data[1]).emit("wordSelected",data[0]);
  })
      socket.on('disconnect',()=>{ 
          // waitingPlayerToGuess= waitingPlayerToGuess.filter(item=> item !=socket.id)
              for(let roomID in activeInGame){
                const players= activeInGame[roomID];
                if(players.includes(socket.id)){
                    const opponent = players.find((item)=> item!=socket.id);
                    if(opponent){
                        io.to(opponent).emit("opponent_disconnect","Opponent disconnected")
                    }
                }
                delete activeInGame[roomID]; // Clean up the room
                break;               
              }  
            })
  }); 


  function timer(){
    let i=1;
    let intervelID=''
    return ()=>{
    return intervelID= setInterval(()=>{
i++


      },1000)
    }
  }

  const t =timer();
  console.log(t)
  
server.listen(port,()=>{
  console.log("server is running at 5000 port")
})