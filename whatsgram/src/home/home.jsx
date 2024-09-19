import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageContainer from './components/MessageContainer';

const Home = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  useEffect(() => {
    setIsSidebarVisible(!selectedUser); 
  }, [selectedUser]);

  return (
    <div className='flex flex-col md:flex-row justify-between w-full 
      md:min-w-[550px] md:max-w-[75%] 
      h-[90%] md:h-[85%] mx-auto 
      bg-gradient-to-r from-gray-700 via-gray-900 to-black 
      rounded-xl shadow-2xl overflow-hidden'>

      {/* Sidebar */}
      <div className={`w-full md:w-1/3 transition-transform duration-300 ease-in-out ${isSidebarVisible ? 'block' : 'hidden md:block'} bg-white backdrop-filter backdrop-blur-lg bg-opacity-40`}>
        <Sidebar onSelectUser={handleUserSelect} />
      </div>

      {/* Divider */}
      <div className={`divider md:flex ${selectedUser ? 'block' : 'hidden'} h-full w-[1px] bg-gray-500 mx-3`} />

      {/* Message Container */}
      <div className={`flex-auto transition-transform duration-300 ease-in-out bg-gray-300 rounded-xl shadow-lg p-4 ${selectedUser ? 'block' : 'hidden md:block'}`}>
        {selectedUser ? (
          <MessageContainer onBackUser={handleShowSidebar} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <h2 className="text-xl font-semibold">Select a user to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
