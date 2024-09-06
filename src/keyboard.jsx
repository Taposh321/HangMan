import React,{useContext,useEffect,useState,useRef} from 'react'
import context from './context'

export default function Keyboard(){

 const {value,setValue,socket,roomID}=useContext(context)
 const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
   
  ];

  function handleKeyClick(key){
    socket.emit("massage",[key,roomID]);
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