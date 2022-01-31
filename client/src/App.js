import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:3005")

function App() {

  let [showLogInModal, setShowLogInModal] = useState(true)
  let [userName, setUserName] = useState("")
  let [message, setMessage] = useState("")
  let [messages, setMessages] = useState([])

  function onLogIn(e){
    e.preventDefault()
    setShowLogInModal(false)
  }

  function onSendMessage(e){
    e.preventDefault()

    if(message === ""){
      console.log("ok")
    } else{
      socket.emit('message', {user: userName, message: message})
      setMessage("")
    }   
  }

  useEffect(() =>{

    socket.on('message', (message) =>{
      setMessages([...messages, message])

      if(document.getElementById(message.id))
        document.getElementById(message.id).scrollIntoView()
 
    })

    return () => {
      socket.off();
    }
    
  }, [messages])
  

  return (
  <div className="flex justify-center items-center w-screen h-screen bg-gray-500">
    {showLogInModal ? (<div className="flex flex-col gap-4">
      <span className="text-white text-lg font-bold text-center">Welcome to the chat</span>
        <form onSubmit={onLogIn} className="flex flex-col shadow-xl">
          <input placeholder="Choose a name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="bg-black font-semibold text-white focus:outline-none p-2 text-center"></input>
          <button type="submit" className="bg-blue-600 font-semibold text-white p-2" disabled={!userName}>Log in</button>
        </form>
      </div>) : 
    (<div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-500 gap-4">
      <span className="text-white text-lg font-bold">Logged in as <span className="underline">{userName}</span></span>
      <div className="flex flex-col w-72 h-72 overflow-x-hidden overflow-y-auto bg-white rounded-lg p-2" id="hey">
        {messages.map((message) =>{
          return <div id={message.id} key={message.id}>
            <span className="text-black font-semibold">{message.user}</span>: <span className={`${message.message.indexOf(' ') >= 0 ? "break-words" : "break-all"}`}>{message.message}</span>
             </div>
        })}
      </div>
      <form onSubmit={onSendMessage} className="flex flex-col shadow-xl">
          <input placeholder="Send a message" value={message} onChange={(e) => setMessage(e.target.value)}
          className="bg-black font-semibold text-white focus:outline-none p-2 text-center"></input>
          <button type="submit" className="bg-blue-600 font-semibold text-white p-2" disabled={!message}>Send</button>
        </form>
    </div>)}
    
  </div>
  )
}

export default App;
