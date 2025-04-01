import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Users, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { NavButton } from './components/NavButton';
import { Avatar } from './components/Avatar';

export const Sidebar = ({ isDarkMode, setIsDarkMode }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const { notifications } = useContext(ChatContext);
  const notificationCount = notifications.filter((n) => n.isRead === false).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex flex-row items-center w-full z-50 justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 md:w-16 md:h-screen md:flex-col md:py-4 md:px-0 md:static">
      <div className="hidden md:block md:mb-8">
        <Avatar avatarId={user?.avatarId || 0} userId={user?._id} onlineDisabled />
      </div>
      
      <div className="flex flex-row justify-center space-x-4 md:flex-col md:space-x-0 md:space-y-4 md:flex-grow md:justify-start">
        <NavLink to="/messages">
          {({ isActive }) => (
            <NavButton icon={<MessageSquare size={20} />} active={isActive} />
          )}
        </NavLink>
        <NavLink to="/users">
          {({ isActive }) => (
            <NavButton icon={<Users size={20} />} active={isActive} />
          )}
        </NavLink>
        <NavLink to="/notifications">
          {({ isActive }) => (
            <NavButton icon={<Bell size={20} />} active={isActive} notificationCount={notificationCount} />
          )}
        </NavLink>
      </div>

      <div className="flex flex-row justify-center space-x-4 mb-0.5 md:mb-0 ml-4 md:ml-0 md:flex-col md:mt-auto md:space-x-0 md:space-y-4 md:flex-grow md:justify-end">
        <NavButton
          onClick={() => setIsDarkMode(!isDarkMode)}
          icon={isDarkMode ? <Moon size={20} color="#787492" /> : <Sun size={20} color="#ffd319" />}
        />
        <NavButton onClick={logoutUser} icon={<LogOut size={20} color="#cc0000" />} />
      </div>
    </nav>
  );
};