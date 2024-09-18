import { useState,useEffect, useContext } from 'react'
import { io } from 'socket.io-client';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {  faHeart} from '@fortawesome/free-solid-svg-icons';
import { HashLoader } from 'react-spinners';
import Context from './context'
import Keyboard from './keyboard'
import Display from './Display'

const SOCKET_SERVER_URL = 'http://localhost:5000'
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });
let roomID=''
const countries = [
  { word: "Argentina", hint: "Counrty Name" },
  { word: "Australia", hint: "Counrty Name" },
  { word: "Austria", hint: "Counrty Name" },
  { word: "Belgium", hint: "Counrty Name" },
  { word: "Brazil", hint: "Counrty Name" },
  { word: "Canada", hint: "Counrty Name" },
  { word: "Chile", hint: "Counrty Name" },
  { word: "China", hint: "Counrty Name" },
  { word: "Colombia", hint: "Counrty Name" },
  { word: "Croatia", hint: "Counrty Name" },
  { word: "Czechia", hint: "Counrty Name" },
  { word: "Denmark", hint: "Counrty Name" },
  { word: "Dominica", hint: "Counrty Name" },
  { word: "Ecuador", hint: "Counrty Name" },
  { word: "Egypt", hint: "Counrty Name" },
  { word: "Estonia", hint: "Counrty Name" },
  { word: "Ethiopia", hint: "Counrty Name" },
  { word: "Finland", hint: "Counrty Name" },
  { word: "France", hint: "Counrty Name" },
  { word: "Germany", hint: "Counrty Name" },
  { word: "Greece", hint: "Counrty Name" },
  { word: "Guatemala", hint: "Counrty Name" },
  { word: "Hungary", hint: "Counrty Name" },
  { word: "Iceland", hint: "Counrty Name" },
  { word: "India", hint: "Counrty Name" },
  { word: "Indonesia", hint: "Counrty Name" },
  { word: "Iran", hint: "Counrty Name" },
  { word: "Iraq", hint: "Counrty Name" },
  { word: "Ireland", hint: "Counrty Name" },
  { word: "Israel", hint: "Counrty Name" },
  { word: "Italy", hint: "Counrty Name" },
  { word: "Jamaica", hint: "Counrty Name" },
  { word: "Japan", hint: "Counrty Name" },
  { word: "Jordan", hint: "Counrty Name" },
  { word: "Kazakhstan", hint: "Counrty Name" },
  { word: "Kenya", hint: "Counrty Name" },
  { word: "Kuwait", hint: "Counrty Name" },
  { word: "Latvia", hint: "Counrty Name" },
  { word: "Lebanon", hint: "Counrty Name" },
  { word: "Lithuania", hint: "Counrty Name" },
  { word: "Luxembourg", hint: "Counrty Name" },
  { word: "Malaysia", hint: "Counrty Name" },
  { word: "Maldives", hint: "Counrty Name" },
  { word: "Mexico", hint: "Counrty Name" },
  { word: "Monaco", hint: "Counrty Name" },
  { word: "Mongolia", hint: "Counrty Name" },
  { word: "Morocco", hint: "Counrty Name" },
  { word: "Nepal", hint: "Counrty Name" },
  { word: "Netherlands", hint: "Counrty Name" },
  { word: "New Zealand", hint: "Counrty Name" },
  { word: "Nigeria", hint: "Counrty Name" },
  { word: "Norway", hint: "Counrty Name" },
  { word: "Oman", hint: "Counrty Name" },
  { word: "Pakistan", hint: "Counrty Name" },
  { word: "Panama", hint: "Counrty Name" },
  { word: "Peru", hint: "Counrty Name" },
  { word: "Philippines", hint: "Counrty Name" },
  { word: "Poland", hint: "Counrty Name" },
  { word: "Portugal", hint: "Counrty Name" },
  { word: "Qatar", hint: "Counrty Name" },
  { word: "Romania", hint: "Counrty Name" },
  { word: "Russia", hint: "Counrty Name" },
  { word: "Saudi Arabia", hint: "Counrty Name" },
  { word: "Senegal", hint: "Counrty Name" },
  { word: "Serbia", hint: "Counrty Name" },
  { word: "Singapore", hint: "Counrty Name" },
  { word: "Slovakia", hint: "Counrty Name" },
  { word: "Slovenia", hint: "Counrty Name" },
  { word: "South Africa", hint: "Counrty Name" },
  { word: "South Korea", hint: "Counrty Name" },
  { word: "Spain", hint: "Counrty Name" },
  { word: "Sri Lanka", hint: "Counrty Name" },
  { word: "Sudan", hint: "Counrty Name" },
  { word: "Sweden", hint: "Counrty Name" },
  { word: "Switzerland", hint: "Counrty Name" },
  { word: "Syria", hint: "Counrty Name" },
  { word: "Taiwan", hint: "Counrty Name" },
  { word: "Tanzania", hint: "Counrty Name" },
  { word: "Thailand", hint: "Counrty Name" },
  { word: "Tunisia", hint: "Counrty Name" },
  { word: "Turkey", hint: "Counrty Name" },
  { word: "Uganda", hint: "Counrty Name" },
  { word: "Ukraine", hint: "Counrty Name" },
  { word: "United Arab Emirates", hint: "Counrty Name" },
  { word: "United Kingdom", hint: "Counrty Name" },
  { word: "United States", hint: "Counrty Name" },
  { word: "Uruguay", hint: "Counrty Name" },
  { word: "Uzbekistan", hint: "Counrty Name" },
  { word: "Venezuela", hint: "Counrty Name" },
  { word: "Vietnam", hint: "Counrty Name" },
  { word: "Yemen", hint: "Counrty Name" },
  { word: "Zambia", hint: "Counrty Name" },
  { word: "Zimbabwe", hint: "Counrty Name" },
  { word: "Andorra", hint: "Counrty Name" },
  { word: "Bahamas", hint: "Counrty Name" },
  { word: "Barbados", hint: "Counrty Name" },
  { word: "Belize", hint: "Counrty Name" },
  { word: "Bhutan", hint: "Counrty Name" },
  { word: "Botswana", hint: "Counrty Name" },
  { word: "Brunei", hint: "Counrty Name" },
  { word: "Burundi", hint: "Counrty Name" },
];
const animals = [
 { word: "Lion", hint: "Large carnivorous feline known as the 'King of the Jungle'" },
 { word: "Tiger", hint: "Large striped feline found in Asia" },
 { word: "Elephant", hint: "Largest land animal with a trunk" },
 { word: "Giraffe", hint: "Tall mammal with a long neck found in Africa" },
 { word: "Kangaroo", hint: "Marsupial that hops and carries its young in a pouch" },
 { word: "Panda", hint: "Black and white bear-like mammal that eats bamboo" },
 { word: "Koala", hint: "Tree-dwelling marsupial from Australia" },
 { word: "Zebra", hint: "African equid with distinctive black and white stripes" },
 { word: "Leopard", hint: "Spotted big cat known for its agility and stealth" },
 { word: "Rhinoceros", hint: "Large herbivore with one or two horns on its snout" },
 { word: "Hippopotamus", hint: "Large semi-aquatic mammal known for its massive mouth" },
 { word: "Cheetah", hint: "Fastest land animal known for its speed" },
 { word: "Gorilla", hint: "Largest primate, native to African forests" },
 { word: "Chimpanzee", hint: "Highly intelligent primate closely related to humans" },
 { word: "Orangutan", hint: "Large orange-furred primate found in Borneo and Sumatra" },
 { word: "Wolf", hint: "Pack-hunting wild canine known for its howling" },
 { word: "Fox", hint: "Small, agile, and clever wild canine" },
 { word: "Bear", hint: "Large mammal with thick fur and a powerful build" },
 { word: "Deer", hint: "Graceful herbivore with antlers" },
 { word: "Moose", hint: "Largest species of deer with massive antlers" },
 { word: "Buffalo", hint: "Large bovid found in Africa and Asia" },
 { word: "Antelope", hint: "Swift herbivore with long legs and horns" },
 { word: "Camel", hint: "Desert mammal with humps on its back" },
 { word: "Horse", hint: "Domesticated hoofed mammal used for riding" },
 { word: "Donkey", hint: "Domesticated hoofed mammal known for its stubbornness" },
 { word: "Sheep", hint: "Woolly farm animal often raised for wool and meat" },
 { word: "Goat", hint: "Hardy domesticated mammal known for climbing" },
 { word: "Cow", hint: "Domesticated bovine raised for milk and meat" },
 { word: "Pig", hint: "Domesticated mammal known for its intelligence and foraging" },
 { word: "Dog", hint: "Domesticated canine known as 'man's best friend'" },
 { word: "Cat", hint: "Domesticated feline known for its independence" },
 { word: "Rabbit", hint: "Small mammal with long ears and a fluffy tail" },
 { word: "Squirrel", hint: "Tree-dwelling rodent with a bushy tail" },
 { word: "Raccoon", hint: "Nocturnal mammal known for its 'masked' face" },
 { word: "Hedgehog", hint: "Small spiny mammal that curls up when threatened" },
 { word: "Bat", hint: "Only flying mammal, known for its echolocation" },
 { word: "Otter", hint: "Aquatic mammal known for its playful behavior" },
 { word: "Beaver", hint: "Rodent known for building dams and lodges" },
 { word: "Skunk", hint: "Small mammal known for its strong-smelling spray" },
 { word: "Badger", hint: "Burrowing mammal known for its distinctive markings" },
 { word: "Armadillo", hint: "Small armored mammal with a leathery shell" },
 { word: "Sloth", hint: "Slow-moving arboreal mammal found in Central and South America" },
 { word: "Opossum", hint: "North America's only marsupial" },
 { word: "Platypus", hint: "Egg-laying mammal with a duck-like bill" },
 { word: "Eagle", hint: "Large bird of prey with powerful vision" },
 { word: "Falcon", hint: "Fast-flying bird of prey known for its diving speed" },
 { word: "Hawk", hint: "Medium-sized bird of prey known for hunting small animals" },
 { word: "Owl", hint: "Nocturnal bird of prey known for its hooting call" },
 { word: "Parrot", hint: "Colorful bird known for its ability to mimic sounds" },
 { word: "Penguin", hint: "Flightless seabird known for its distinctive waddle" },
 { word: "Peacock", hint: "Bird known for its vibrant tail feathers" },
 { word: "Swan", hint: "Large waterbird with a long neck and graceful posture" },
 { word: "Flamingo", hint: "Pink wading bird known for its one-legged stance" },
 { word: "Duck", hint: "Aquatic bird known for its quacking sound" },
 { word: "Goose", hint: "Waterfowl with a honking call" },
 { word: "Pelican", hint: "Large waterbird with a distinctive pouch under its beak" },
 { word: "Stork", hint: "Large bird known for delivering babies in folklore" },
 { word: "Dove", hint: "Symbolic bird of peace" },
 { word: "Seagull", hint: "Coastal bird known for its loud calls" },
 { word: "Crow", hint: "Intelligent black bird known for problem-solving" },
 { word: "Sparrow", hint: "Small, brown, and common bird" },
 { word: "Robin", hint: "Small bird known for its red chest" },
 { word: "Hummingbird", hint: "Tiny bird known for its rapid wing beats" },
 { word: "Butterfly", hint: "Insect with colorful wings" },
 { word: "Bee", hint: "Flying insect known for pollination and making honey" },
 { word: "Wasp", hint: "Stinging insect known for its aggressive behavior" },
 { word: "Ant", hint: "Small insect known for its strength and teamwork" },
 { word: "Grasshopper", hint: "Jumping insect known for its chirping" },
 { word: "Cricket", hint: "Insect known for its chirping at night" },
 { word: "Ladybug", hint: "Small beetle known for its red and black spots" },
 { word: "Dragonfly", hint: "Fast-flying insect with large, transparent wings" },
 { word: "Frog", hint: "Amphibian known for its jumping ability and croaking" },
 { word: "Toad", hint: "Warty-skinned amphibian" },
 { word: "Snake", hint: "Legless reptile known for its slithering movement" },
 { word: "Lizard", hint: "Reptile with a long tail and quick movements" },
 { word: "Turtle", hint: "Reptile with a protective shell" },
 { word: "Crocodile", hint: "Large aquatic reptile known for its powerful jaws" },
 { word: "Alligator", hint: "Large reptile similar to a crocodile, found in the US and China" },
 { word: "Shark", hint: "Marine predator with sharp teeth" },
 { word: "Dolphin", hint: "Intelligent marine mammal known for its playful behavior" },
 { word: "Whale", hint: "Large marine mammal known for its size" },
 { word: "Octopus", hint: "Cephalopod with eight arms and high intelligence" },
 { word: "Squid", hint: "Marine creature related to octopus with a streamlined body" },
 { word: "Jellyfish", hint: "Gelatinous marine creature with stinging tentacles" },
 { word: "Starfish", hint: "Marine animal with a star-shaped body" },
 { word: "Crab", hint: "Crustacean known for its sideways walk" },
 { word: "Lobster", hint: "Crustacean with claws, often red when cooked" },
 { word: "Shrimp", hint: "Small crustacean often found in marine environments" },
 { word: "Snail", hint: "Mollusk with a coiled shell" },
 { word: "Slug", hint: "Shell-less mollusk similar to a snail" },
 { word: "Worm", hint: "Small, soft-bodied invertebrate" }
]
const bothArray=[countries,animals];

function LoadingScreen({text}){
  return(<>
  <div className='loading'>
    <div>  {text}
</div>
   <HashLoader color='white' />
  </div>
  </>)
 }

 function Home(){
  const {playSound,sound,setSound} =useContext(Context)
  const connect=()=>{
    if(sound){
      playSound(2).play();
    }
    if (socket) {
       // Check if socket instance is defined
      socket.connect(); // Connect to the server

    } 
}

const soundHandler=()=>{
  if(!sound) playSound(2).play()
sound?setSound(false):setSound(true);
}

useEffect(()=>{
  // playSound(1).play();
return ()=>{
}
},[])
  return(<>
  {

  <div className='menu'>
    <div className='menuWrapper'>
      <div className='quickPlay menuBtn' onClick={()=>{connect()}}>Quick Play</div>
      <div className='playWithComputer menuBtn'>Play with computer</div>
      <div onClick={soundHandler} className='createRoom menuBtn'>{sound?"Sound on":"Sound off"} </div>
 </div>

<div className='repoLink'>
{/* Github repository link -<FontAwesomeIcon icon={faGithub} size='xl'  />  */}
 </div>
</div>}
  </>)
 }
 function MenuScreen({setmode}){
  const [time,setTime]=useState(5)
  const [intervalID,setIntervalID]=useState();
  const select=(x)=>{
   socket.emit('modeSelect',[roomID,x,socket.id])
   setmode(false);
  }

  useEffect(()=>{
    let timerID=setInterval(()=>{ 

       setTime((pre)=>{
         if(pre==1){
           socket.emit('modeSelect',[roomID,"letGuess",socket.id])
           clearInterval(timerID)
           setmode(false)
           return pre
         }
         return pre-1
       })
     },1000);

   setIntervalID(timerID);

 return ()=>{
   clearInterval(intervalID);
 }
},[])

return(<> 
   <div className='popUpSelectMode'>
    <div className='timer'>{time}s</div>
    <div onClick={ ()=>{select("guess")}}>Guess</div>
    <div onClick={()=>{select("letGuess")}}>Pick word</div>
   </div>
</>)
}  
function Game(){
  const [gameScene,setGameScene]= useState(null) 
  const [mode,setMode]=useState(true);
  const{chooserID,lifes,correctGuess} =useContext(Context)
  useEffect(()=>{
    socket.on("getSelectedMode",(data)=>{
      if(socket.id==data[2] ){
       if(data[1]=="guess"){
         setGameScene(<GuessScreen />)
       }else{
         setGameScene(<LetOneGuessScreen />)
       }
      }else{
       if(data[1]=='guess'){
         setGameScene(<LetOneGuessScreen />)
       }else{
         setGameScene(<GuessScreen />)
       } 
      } 
   })
   
     },[])

  return(<>
  <div className='game'>
    <div className='gameWrapper itemOne'>
    <div className='userContainer'>
      <div className='socreBored'> 
        <div className='score'>Score</div>
       <div className='myScore'>Corrected Guess: {correctGuess}</div>
     <div className='opponentScore'>Opponent Guess:</div>
    </div>
   
    <div className="timesRemaining">
    
       {
       Array(6).fill(null).map((_,i)=>{
        if(i<lifes){
         return <span key={i} className='time' style={{background:'red'}}>  </span>
        }else{
          return <span key={i} className='time'> </span>

        }
       }
       )
       }
      </div>
  
    </div>
    <div className='hanManContainer'>
   
      <div className='hangingBodyContainer'>
      </div>
    </div>
    </div>
    <div className='itemTwo'>

    {
      chooserID==socket.id && mode==true ?<MenuScreen setmode={setMode} />:''
    }
    {
      gameScene
    }
    </div>
  </div>

  </>)
}
function GuessScreen(){
  const {selectedWord,totalFlipAble,playSound} =useContext(Context)
  const [h,setH]=useState('');
  const [animate,setAnimate]=useState(false);
  
  useEffect(()=>{
   socket.on("getHint",(data)=>{
  setH(data);
  setAnimate(true);
  setTimeout(() => setAnimate(false), 9000); 
})
socket.on('wordSelected',()=>{
 playSound(3).play()
})
},[])

  return(<>
  
<div className='guessContainer'>
  {
    <div className='keyboard-display'>
    <div className='displayContainer'>
    <div className='hintContainer'>
      {
        selectedWord.word?"":<div className='chooseWordIndication'>Opponent is choosing word</div>
      }
    <div className="defaultHint"> {selectedWord!=''?"Hint: " + selectedWord.hint:""}</div>
  <div className='animatedHint'>
    <div  className={`hintText ${animate?"animate":""} `}>
    {h}
    </div>
    </div>
  </div>
      <Display wordFlipAble={true} />
      <div > {selectedWord? ( 'Flips : '+totalFlipAble ):''}</div>
   </div>
    <Keyboard />
    </div>
  }
 
  </div>
 
  </>)
}

function LetOneGuessScreen(){
  const {playSound,readOnly,setReadOnly,disabled,setDisabled,setSelectedWord,selectedWord}=useContext(Context)
   //input handler
  const [sw,setSw]=useState('');
  const sendHint=(v)=>{
   socket.emit("hint",[v,roomID])
    }
   const sendWord=()=>{

    if(sw!=""){

      setReadOnly(true);
      setDisabled(true)
      socket.emit("word",[sw,roomID]);
    //Update parent setSelectedWord state from this component for context
    }
   }
   const pick=()=>{
    playSound(5).play()
let randomNumber=Math.floor(Math.random() * (2 - 0) + 0);
let selectedArray=bothArray[randomNumber];
let randomPicker=Math.floor(Math.random() * (selectedArray.length - 0) + 0);
let picked=selectedArray[randomPicker];
  setSw(picked);
   }
 
  return (<>
   <div className='LetOneGuessScreen'>
    <div className='displayContainer'>
      <div className='displayAverter'>
        <div className='status'>{selectedWord.word?"":'Opponent is waiting for challenge'}</div>
      </div>
  <Display wordFlipAble={false} />
    </div>
<div className='selectionContainer'>
<div className="selection">
<div>Select Word </div>
<div  className='selectWord' >
  <div style={{fontSize:'13px',display:'flex',justifyContent:'center',alignItems:'center'}}>{sw!="" ? '':'No word selected'}</div>
  <div className='selectedWord'>{sw!="" ? sw.word:''}</div>
  <button onClick={pick} disabled={disabled} className='randomlyPick'>
  Shuffle
  </button>
</div>
<button onClick={sendWord} className={`sendWord ${readOnly==true?'readOnly':''}`} disabled={readOnly}>
Challenge this word!
</button>
</div>
  <div className='controls'> 
    <div className='hint'>
      <div>Quick massages</div>
     
      <div className='inputs'>
        <span onClick={()=>{sendHint('Play Fast please')}}>Play Fast please</span>
        <span onClick={()=>{sendHint('Hello')}}>Hello</span>
        <span onClick={()=>{sendHint('hi')}}>Hi</span>
        <span onClick={()=>{sendHint('Easy word')}}>Easy word</span>
        <span onClick={()=>{sendHint( 'Not Easy')}}>Not Easy</span>
        <span onClick={()=>{sendHint('cool!')}}>cool!</span>
        <span onClick={()=>{sendHint('Great job')}}>Great job</span>
        <span onClick={()=>{sendHint('Thank you')}}>Thank you</span>
        <span onClick={()=>{sendHint('My pleasure')}}>My pleasure</span>

      </div>
  </div>
  </div>
  </div>
  </div>
  </>)
}

function App() {
  const [value,setValue]= useState('');
  const [scene,setScene]=useState(null);
  const [selectedWord,setSelectedWord]=useState('');
  const [wrong,setWrong]=useState([]);
  const [lifes,setLifes]=useState(0);
  const [correctGuess,setCorrectGuess]=useState(0);
  const [readOnly,setReadOnly]=useState(false)
  const [disabled,setDisabled]=useState(false)
  const [chooserID,setChooserID]=useState('');
  const [totalFlipAble,setTotalFlipAble]=useState(0);
  const [sound,setSound]=useState(true)
  const [loading, setLoading] = useState(true);
  const [audioFiles, setAudioFiles] = useState([
    './assets/sound/click.wav',
    './assets/sound/background.mp3',
    './assets/sound/click2.mp3',
     './assets/sound/wordSelected.mp3',
     './assets/sound/wrong.wav',
      './assets/sound/suffle.mp3',
      './assets/sound/correctGuess.mp3'
  ]);
  const [audioRefs, setAudioRefs] = useState([]);

  useEffect(() => {
    const loadAudioFiles = async () => {
      const audioPromises = audioFiles.map((file) => {
        return new Promise((resolve) => {
          const audio = new Audio(file);
          audio.oncanplaythrough = () => resolve(audio);
          audio.volume=.5
          audio.onerror = () => resolve(null); // Handle error gracefully
        });
      });
      const loadedAudios = await Promise.all(audioPromises);
      setAudioRefs(loadedAudios);
      setLoading(false);
    };

    loadAudioFiles();

  }, [audioFiles]);

 const playSound = (index) => {
    if (audioRefs[index]) {
       return audioRefs[index];
    }
  }

  useEffect(() => {
     socket.on("matched",(data)=>{
       roomID=data[0];
       setChooserID(data[1])
       setScene(<Game  />); 
     });
    socket.on("waitingForOpponet",()=>{
         setScene(<LoadingScreen text={"Waiting for Opponent"} />)
      });
    socket.on("opponent_disconnect",()=>{
        alert("Opponent disconnected")
       })
       socket.on("wordSelected",(data)=>{
        setTotalFlipAble(data[1])
        setSelectedWord(data[0]);
      })
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  
  return (
    <>
      <Context.Provider value={{sound,setSound,playSound,totalFlipAble,setTotalFlipAble,chooserID,lifes,setLifes,readOnly,setReadOnly,disabled,setDisabled,correctGuess,setCorrectGuess,wrong,setWrong,value,setValue,socket,roomID,countries,animals,selectedWord,setSelectedWord,scene,setScene}}>
        {
          loading? <LoadingScreen text={'Loading assets'} />:  <div className='container'>
          {
         scene ? scene : <Home />      
          }
                
            </div>
        }
       
      </Context.Provider>
    </>
  )
}

export default App
