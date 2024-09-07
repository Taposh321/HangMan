import React ,{useContext,useState,useRef,useEffect} from'react'
 import context from './context'

export default function Display(){
 const {value,setValue,socket}= useContext(context);
 const [selectedWord,setSelectedWord]= useState('')
useEffect(()=>{
socket.on("keyPressed",(data)=>{
setValue((pre)=>pre+data)
})
socket.on("wordSelected",(data)=>{
   setSelectedWord(data) 
})

},[]);


return(<>
<div className='display'>
     <div className="words">

        {
         selectedWord==""?"":
    Array(selectedWord.word.length).fill(null).map((_,index)=>(
       <div key={index} className='word-space'>{
      index<value.length?value[index]:""
        }
         </div>
    ))
        }
     </div>
     
</div>
</>)
}
