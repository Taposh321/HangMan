import React, { useContext, useState, useEffect } from 'react';
import Context from './context';

export default function Display({wordFlipAble}) {
  const {playSound,totalFlipAble,setTotalFlipAble, setLifes,setReadOnly,setDisabled, setSelectedWord,value, setValue, socket,selectedWord,wrong,setWrong,setCorrectGuess } = useContext(Context);
  const [index, setIndex] = useState(0);
  const [fliped,setFliped]=useState([]);
   
  const flip = (i) => {
    if(wordFlipAble && totalFlipAble > 0) {
      setTotalFlipAble((pre) => pre - 1);
      setFliped((pre) => [...pre, i]);
    }
  };

  useEffect(() => {

     const reset=()=>{
      setCorrectGuess((pre) => pre + 1);
      setIndex(0);
      setValue('');
      setWrong([]);
      setSelectedWord('');
      setDisabled(false);
      setReadOnly(false);
      setTotalFlipAble(0);
      setFliped([]);
     }
     const handleKeyPressed = (data) => {
      // Check if we are at the end of the word and if there are still lives left

      if (index == selectedWord.word.length-1  && wrong.length < 6) {
        playSound(6).play()
        setValue((prev) => prev + data);
        setTimeout(()=>{reset()},2000)
         return 0;
      }
      // If the current index is flipped, skip processing for this index
    

      if (index < selectedWord.word.length-1  && data.trim().toLowerCase() === selectedWord.word[index]?.trim().toLowerCase()) {
        setValue((prev) => prev + data);

      } else if (index <= selectedWord.word.length - 1 && data.trim().toLowerCase() !== selectedWord.word[index]?.trim().toLowerCase()) {
        //Wrong guess
        playSound(4).play()
        let correctLetter = selectedWord.word[index];
        setWrong((pre) => [...pre, index]);
        setLifes((pre) => pre<6?pre +1 :0);
        setValue((prev) => prev + correctLetter);
      } else {
        setSelectedWord('');
      }
      setIndex((prev) => prev + 1);

    };

    socket.on('keyPressed', handleKeyPressed);
    // Cleanup listeners on unmount
    return () => {
      socket.off('keyPressed', handleKeyPressed);
    };
  }, [socket, selectedWord, index, fliped]); // Added fliped as a dependency

  return (
    <>
      <div className='display'>
        <div className="words">
          {selectedWord.word && Array(selectedWord.word.length).fill(null).map((_, i) => (
            <div key={i} onClick={ () => wordFlipAble ? flip(i) : null } className={`word-space ${wrong.includes(i) ? "wrongWord" : ''}`}>
              {

              i < value.length && i==0 ?value[i]: 
              i < value.length && i>0 ?value[i].toLowerCase():
              fliped.includes(i) ? <div className='flipedWord'>{selectedWord.word[i]}</div> : ''
              
              }
            
            </div>
          )) }
        </div>
      </div>
    </>
  );
}
