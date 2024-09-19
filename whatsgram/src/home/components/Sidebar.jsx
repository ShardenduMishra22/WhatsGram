import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5'
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../Zustan/userConversation';
import { useSocketContext } from '../../context/SocketContext';

const Sidebar = ({ onSelectUser }) => {

    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const { socket, onlineUser } = useSocketContext();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchuser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSetSelectedUserId] = useState(null);
    const { message , selectedConversation, setSelectedConversation } = userConversation();
    const [newMessageUsers, setNewMessageUsers] = useState('');

    const talkedwith = chatUser.map((user) => (user._id));

    const isOnline = talkedwith.map(userId => onlineUser.includes(userId))
    
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await axios.get(`/api/user/currentchatters`)
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false)
                    console.log(data.message);
                }
                setLoading(false)
                setChatUser(data)

            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
        chatUserHandler()
    }, [])

    const handelSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message);
            }
            setLoading(false)
            if (data.length === 0) {
                toast.info("User Not Found")
            } else {
                setSearchuser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const handelUserClick = (user) => {
        onSelectUser(user)
        setSetSelectedUserId(user._id)
        setSelectedConversation(user)
    }

    const handSearchback = () => {
        setSearchuser([]);
        setSearchInput('')
    }

    useEffect(()=>{
        socket?.on('newMessage',(newMessage)=>{
            setNewMessageUsers(newMessage)
        })
        return ()=> socket?.off("newMessage")
    },[socket,message])

    const handelLogOut = async () => {
        const confirmlogout = window.prompt("type 'UserName' To LOGOUT");
        if (confirmlogout === authUser.username) {
            setLoading(true)
            try {
                const logout = await axios.post('/api/auth/logout')
                const data = logout.data;
                if (data?.success === false) {
                    setLoading(false)
                    console.log(data?.message);
                }
                toast.info(data?.message)
                localStorage.removeItem('chatapp')
                setAuthUser(null)
                setLoading(false)
                navigate('/login')
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        } else {
            toast.info("LogOut Cancelled")
        }
    }

    return (
        <div className='h-full w-auto p-3 bg-white shadow-lg rounded-lg'>
            <div className='flex justify-between gap-2 items-center'>
                <form onSubmit={handelSearchSubmit} className='flex items-center bg-gray-100 rounded-full px-3 w-full'>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='bg-transparent outline-none w-full py-2 px-3 rounded-full text-gray-700'
                        placeholder='Search user...'
                    />
                    <button type="submit" className='p-2 bg-sky-700 text-white rounded-full hover:bg-sky-800'>
                        <FaSearch />
                    </button>
                </form>
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    className='h-12 w-12 rounded-full cursor-pointer hover:scale-110 transition-transform'
                />
            </div>
            <div className='mt-4'>
                {searchUser?.length > 0 ? (
                    <div className="overflow-y-auto">
                        {searchUser.map((user) => (
                            <div key={user._id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-200 rounded-lg" onClick={() => handelUserClick(user)}>
                                <div className={`avatar ${isOnline[user._id] ? 'online' : ''}`}>
                                    <img src={user.profilepic} alt='user' className='rounded-full h-12 w-12' />
                                </div>
                                <div className='text-gray-900 font-semibold'>{user.username}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-y-auto">
                        {chatUser.length === 0 ? (
                            <div className="text-center text-gray-600">No conversations found. Start a new chat!</div>
                        ) : (
                            chatUser.map((user) => (
                                <div key={user._id} className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-200 rounded-lg ${selectedUserId === user._id ? 'bg-gray-300' : ''}`} onClick={() => handelUserClick(user)}>
                                    <div className={`avatar ${isOnline[user._id] ? 'online' : ''}`}>
                                        <img src={user.profilepic} alt='user' className='rounded-full h-12 w-12' />
                                    </div>
                                    <div className='text-gray-900 font-semibold'>{user.username}</div>
                                    {newMessageUsers && newMessageUsers.senderId === user._id && (
                                        <div className="bg-green-600 text-white text-xs rounded-full px-2 py-1">New</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            <div className='mt-5 flex items-center gap-2'>
                <button onClick={handelLogOut} className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600'>
                    <BiLogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
