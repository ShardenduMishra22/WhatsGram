import React, { useEffect, useRef, useState } from 'react'
import userConversation from '../../Zustan/userConversation';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from 'axios';
import { useSocketContext } from '../../context/SocketContext';
import notify from '../../assets/sound/notification.mp3'


const MessageContainer = ({ onBackUser }) => {
  const { selectedConversation, message , setMessages } = userConversation();
  const { socket, onlineUser } = useSocketContext();
  const id = selectedConversation?._id
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const leastMessageRef = useRef();
  const [sendData, setSendData] = useState("")

  //socketIo
  useEffect(()=>{
    socket?.on("newMessage",(newMessage)=>{
      const sound = new Audio(notify);
      sound.play();
      setMessages([...message,newMessage])
    })

    return ()=> socket?.off("newMessage")
  },[socket, setMessages ,message])

  //scroller
  useEffect(() => {
    setTimeout(() => {
      leastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [message])

  //getMessages
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true)
      try {
        if(selectedConversation === null) return ("Waitting for id")
        const msg = await axios.get(`/api/message/${id}`)
        const data = await msg.data;
        if (data.success === false) {
          setLoading(false)
        }
        setLoading(false)
        setMessages(data)
      } catch (error) {
        setLoading(false)
      } 
    }
    if(id) getMessages()
  }, [id, setMessages])

  //send messages
  const hadelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const sendMsg = await axios.post(`/api/message/send/${id}`, { messages: sendData })
      const data = sendMsg.data;
      if (data.success === false) {
        setLoading(false)
      }
      setLoading(false)
      setSendData("")
      setMessages([...message , data])
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className='md:min-w-[500px] h-full flex flex-col py-2 bg-gray-100'>
      {selectedConversation === null ? (
        <div className='flex items-center justify-center w-full h-full'>
          <div className='px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2'>
            <p className="text-2xl">Welcome!!👋 {authUser.username}😉</p>
            <p className="text-lg">Select a chat to start messaging</p>
            <TiMessages className='text-6xl text-center' />
          </div>
        </div>
      ) : (
        <>
          <div className='flex justify-between gap-2 bg-sky-700 px-4 py-2 rounded-lg h-12'>
            <div className='flex gap-2 items-center w-full'>
              <div className='md:hidden'>
                <button onClick={() => onBackUser(true)} className='bg-white rounded-full p-2'>
                  <IoArrowBackSharp size={25} />
                </button>
              </div>
              <img className='rounded-full w-10 h-10 cursor-pointer' src={selectedConversation?.profilepic} />
              <span className='text-gray-50 font-bold text-lg'>{selectedConversation?.username}</span>
              {onlineUser.includes(selectedConversation?._id) && <span className="bg-green-400 w-2 h-2 rounded-full" />}
            </div>
          </div>

          <div className='flex-1 overflow-auto px-4 py-2 bg-white rounded-lg shadow-md'>
            {loading && (
              <div className="flex w-full h-full items-center justify-center">
                <div className="loading loading-spinner"></div>
              </div>
            )}
            {!loading && message?.length === 0 && (
              <p className='text-center text-gray-500'>Send a message to start Conversation</p>
            )}
            {!loading && message?.length > 0 && message?.map((msg) => (
              <div key={msg?._id} ref={leastMessageRef} className={`my-2 flex ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg ${msg.senderId === authUser._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  {msg?.message}
                  <div className="text-xs opacity-80 mt-1">
                    {new Date(msg?.createdAt).toLocaleDateString('en-IN')} • {new Date(msg?.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={hadelSubmit} className='flex items-center mt-2'>
            <input value={sendData} onChange={(e) => setSendData(e.target.value)} id='message' type='text' className='w-full p-3 rounded-full border border-gray-300 focus:border-sky-500 focus:outline-none' placeholder='Type a message...' />
            <button type='submit' className='ml-2 bg-sky-500 text-white rounded-full p-2 hover:bg-sky-600 focus:ring-2 focus:ring-sky-400'>
              {loading ? <div className='loading loading-spinner'></div> : <IoSend size={25} />}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default MessageContainer;
