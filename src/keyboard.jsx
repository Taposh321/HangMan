import React,{useContext,useEffect,useState,useRef} from 'react'
import context from './context'

let keyClick=0
export default function Keyboard(){
 const [clickSoundSprite,setClickSoundSprite]=useState([])
 const {selectedWord,socket,roomID,playSound}=useContext(context)
 const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];
useEffect(()=>{
  let clickSoundArray=[]
 Array(5).fill(null).map((_,index)=>{
  clickSoundArray.push(playSound(0))
 })
 setClickSoundSprite(clickSoundArray)
},[])

  function handleKeyClick(key){
    if(keyClick<4){
      keyClick++ 
    }else{
      keyClick=0
    }
  
    clickSoundSprite[keyClick].play();

    if(selectedWord.word){
      socket.emit("massage",[key,roomID]);
    }
  }

 return(<>
   <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((key) => (
            <button
              key={key}
              className="key"
              onClick={() => handleKeyClick(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>

 </>)

}