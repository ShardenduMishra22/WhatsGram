import { useEffect, useRef, useState } from 'react'
import userConversation from '../../Zustan/userConversation';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from 'axios';
import { useSocketContext } from '../../context/SocketContext';
import notify from '../../assets/sound/notification.mp3'
import PropTypes from 'prop-types';

const MessageContainer = ({ onBackUser, selectedUser }) => {
  const { selectedConversation, message, setMessages } = userConversation();
  const { socket } = useSocketContext();
  const id = selectedConversation?._id
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();
  const [sendData, setSendData] = useState("")

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    socket?.on("newMessage", handleNewMessage);

    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, setMessages]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    const getMessages = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await axios.get(`/api/message/${id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [id, setMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`/api/message/send/${id}`, { messages: sendData });
      setMessages(prevMessages => [...prevMessages, response.data]);
      setSendData("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-2xl font-semibold mb-2">Welcome, {authUser.username}! 👋😉</p>
          <p className="text-lg mb-4">Select a chat to start messaging</p>
          <TiMessages className="text-6xl mx-auto text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-blue-600 text-white p-3 flex items-center">
        <button onClick={onBackUser} className="md:hidden mr-3">
          <IoArrowBackSharp size={25} />
        </button>
        <img 
          className="w-10 h-10 rounded-full mr-3" 
          src={selectedUser.profilepic} 
          alt={selectedUser.username} 
        />
        <span className="font-semibold">{selectedUser.username}</span>
      </div>

      <div className="flex-grow overflow-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : message?.length === 0 ? (
          <p className="text-center text-gray-500">Send a message to start the conversation</p>
        ) : (
          message?.map((msg) => (
            <div 
              key={msg._id} 
              className={`flex ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'} mb-4`}
              ref={lastMessageRef}
            >
              <div 
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.senderId === authUser._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-100">
        <div className="flex items-center bg-white rounded-full overflow-hidden shadow">
          <input
            value={sendData}
            onChange={(e) => setSendData(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 focus:outline-none"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <IoSend size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

MessageContainer.propTypes = {
  onBackUser: PropTypes.func.isRequired,
  selectedUser: PropTypes.shape({
    profilepic: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }),
};

export default MessageContainer;