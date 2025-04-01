import React, { useState } from 'react';
import { Sidebar } from './layout/Sidebar';
import { List } from './layout/List';
import { ChatArea } from './layout/ChatArea';

const ChatLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300" >
        <Sidebar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <List />
        <ChatArea />
      </div>
    </div>
  );
};

export default ChatLayout;