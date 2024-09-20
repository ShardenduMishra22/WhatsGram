import { useEffect, useState } from 'react';
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
    <div className="card-style flex h-full w-full max-w-4xl mx-auto overflow-hidden">
      <div 
        className={`w-full md:w-1/3 ${
          isSidebarVisible ? 'block' : 'hidden md:block'
        }`}
      >
        <Sidebar onSelectUser={handleUserSelect} />
      </div>
      
      <div className="hidden md:block w-px bg-gray-200"></div>
      
      <div 
        className={`w-full md:w-2/3 ${
          selectedUser || !isSidebarVisible ? 'block' : 'hidden md:block'
        }`}
      >
        <MessageContainer 
          selectedUser={selectedUser} 
          onBackUser={handleShowSidebar}
        />
      </div>
    </div>
  );
};

export default Home;