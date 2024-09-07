import { useState,useEffect,useRef, useContext } from 'react'
import { io } from 'socket.io-client';

import Context from './context'
import Keyboard from './keyboard'
import Display from './Display'

const SOCKET_SERVER_URL = 'http://localhost:5000'
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });
let type=''
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

function LoadingScreen(){
  return(<>
  <div className='loading'>
   Waiting for Opponent...
  </div>
  
  </>)
 }

 function MenuScreen(){
  const connect=(token)=>{
    if (socket) { // Check if socket instance is defined
      socket.auth={token}
      socket.connect(); // Connect to the server
        type=token   
    } 
}

return(<> 
   <div className='menu'>
    <div>
    <div onClick={ ()=>{connect("guess")}}>Guess word (Online)</div>
    <div onClick={()=>{connect("letGuess")}}>Let other Guess (Online)</div>
    <div onClick={()=>{connect("computer")}}>Play with computer</div>
    </div>
   </div>
</>)
}  
function GuessScreen(){
  const [h,setH]=useState('');
  const [animate,setAnimate]=useState(false)
 const [wordSelected,setWordSelected]=useState('');
  useEffect(()=>{
socket.on("getHint",(data)=>{
  setH(data);
  setAnimate(true);
  setTimeout(() => setAnimate(false), 9000); 
})

socket.on("wordSelected",(data)=>{
  setWordSelected(data)
})
  },[])

  return(<>
  

    {/* // wordSelected==""? <div className='timer'>Opponent will choose word in 10 seconds</div>: */}
  

  <div className='hintContainer'>
    <div className="defaultHint">Hint: {wordSelected!=''? wordSelected.hint:""}</div>
  <div className='animatedHint'>
    <div  className={`hintText ${animate?"animate":""} `}>
    {h}
    </div>
    </div>
  </div>
     <Display />
     <Keyboard />
     <div>Request for a hint</div>


 
  </>)
}
function LetOneGuessScreen(){
   //input handler
  const [value,setValue]= useState('');
   const [sw,setSw]=useState('No word picked');

   const sendHint=()=>{
   socket.emit("hint",[value,roomID])
    }

   const sendWord=()=>{
    if(sw!=""){
      socket.emit("word",[sw,roomID]);
    }

   }

   const pick=()=>{
let randomNumber=Math.floor(Math.random() * (2 - 0) + 0);
let selectedArray=bothArray[randomNumber];
let randomPicker=Math.floor(Math.random() * (selectedArray.length - 0) + 0);
let picked=selectedArray[randomPicker];
setSw(picked);
   }

  const handler =(e)=>{
  setValue(e.target.value)
  }

  return (<>
   <div className='LetOneGuessScreen'>
    <Display />

<div className="selection">
<div>Select Word </div>
<div  className='selectWord' >
  <div className='selectedWord'>{sw.word}</div>
  <div onClick={pick} className='randomlyPick'>
  Shuffle
  </div>
</div>

<div onClick={sendWord} className='sendWord'>
Challange this word!
</div>
</div>


  <div className='controls'> 
    <div></div>
    <div className='hint'>
      <div style={{marginRight:"auto",marginLeft:"20px"}} >Give  opponent a hint</div>
     
      <div className='inputs'>
        <input type="text" value={value}  onChange={handler} name="" id="hint" placeholder='Max 15 characters' maxLength={15} />
      <input type="button" value="Send" onClick={sendHint}/> 
      </div>
  </div>
  </div>
 
  </div>
  </>)
}

function App() {
  const [value,setValue]= useState('');
  const [scene,setScene]=useState(null);
  const [selectedWord,setSelectedWord]=useState('')
  useEffect(() => {
     socket.on("matched",(room_id)=>{
       roomID=room_id;
       if(type=="guess"){
            setScene(<GuessScreen />);
          }
         if(type=='letGuess'){
          setScene(<LetOneGuessScreen/>);
        }   
       });

       socket.on("waitingForOpponet",()=>{
         setScene(<LoadingScreen />)
      });
       socket.on("opponent_disconnect",()=>{
        alert("Opponent disconnected")
       })

    return () => {
      socket.disconnect();
    };
  }, [socket]);
  
  return (
    <>
      <Context.Provider value={{value,setValue,socket,roomID,countries,animals,selectedWord,setSelectedWord}}>
         <div className='container'>
       {
      scene ? scene : <MenuScreen />      
       }
             
         </div>
      </Context.Provider>
    </>
  )
}

export default App
