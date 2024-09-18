import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';


import { createServer } from 'node:http';
 import {Server} from 'socket.io'
import cors from 'cors'
const port = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin:'https://hangman-o3z4.onrender.com'
}));

const __fileName= fileURLToPath(import.meta.url);

const __dirname=path.dirname(__fileName)
const distPath= path.resolve(__dirname,'../dist')
console.log(distPath)

//serve static files from react
 app.use(express.static(distPath));

 app.get('*',(req,res)=>{
  res.sendFile(path.join(distPath,'index.html'))
})
const server = createServer(app)
const io = new Server(server,{
    cors:{
    origin:"https://hangman-o3z4.onrender.com:5173"
    },
    method:["GET","POST"]
});

let waitingPlayerToGuess=[];
let type=''
const activeInGame={};
io.on('connection', (socket) => {
  
  waitingPlayerToGuess.push(socket.id)
  //Play with computer
 
    if(waitingPlayerToGuess.length>=2){
      //remove two users from waiting list;
        const playerOne=socket.id;
        const index= waitingPlayerToGuess.indexOf(playerOne)
        waitingPlayerToGuess.splice(index,1);
        const playerTwo=waitingPlayerToGuess.shift();
        //Create unique room id for two users
        const roomID=playerOne+playerTwo;
        io.to(playerOne).socketsJoin(roomID);
        io.to(playerTwo).socketsJoin(roomID);
        activeInGame[roomID]=[playerOne,playerTwo];
        let toChoose=Math.floor(Math.random() * (2 - 0) + 0);
        let chooserID=activeInGame[roomID][toChoose]  
        io.to(roomID).emit("matched",[roomID,chooserID]); 
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
    let flipAble=1
    if(data[0].word.length>=6 && data[0].word.length<=8 ){
      flipAble=2
    }else if(data[0].word.length>=9  ){
      flipAble=3
    }
   
    io.to(data[1]).emit("wordSelected",[data[0],flipAble]);
  })
  socket.on("modeSelect",(data)=>{
    io.to(data[0]).emit("getSelectedMode",data);
  })
  
      socket.on('disconnect',()=>{ 
        if(waitingPlayerToGuess.includes(socket.id)){
          const index= waitingPlayerToGuess.indexOf(socket.id)
        waitingPlayerToGuess.splice(index,1);
        }
              for(let roomID in activeInGame){
                const players= activeInGame[roomID];
                if(players.
                  includes(socket.id)){
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
  
server.listen(port,()=>{
  console.log("server is running at 5000 port")
})