import { useState, useEffect, useContext } from "react";
import { Mail } from "lucide-react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { InboxListItem } from "./InboxListItem";

export const InboxView = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, onlineUsers } = useContext(ChatContext);
  const [isSortByOnline, setIsSortByOnline] = useState(false);
  const [sortedChats, setSortedChats] = useState([]);

  const sortChats = () => {
    if (!userChats || !userChats.length) return [];
    const chatsCopy = [...userChats];
    
    return chatsCopy.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      const recencyDiff = dateB - dateA;
      
      if (!isSortByOnline) {
        return recencyDiff;
      }

      const recipientA = a.members.find(member => member !== user?._id);
      const recipientB = b.members.find(member => member !== user?._id);
      
      const isOnlineA = onlineUsers?.some(onlineUser => onlineUser?.userId === recipientA) || false;
      const isOnlineB = onlineUsers?.some(onlineUser => onlineUser?.userId === recipientB) || false;

      if (isOnlineA !== isOnlineB) {
        return isOnlineA ? -1 : 1;
      }

      return recencyDiff;
    });
  };

  useEffect(() => {
    if (userChats) {
      const sorted = sortChats();
      setSortedChats(sorted);
    }
  }, [userChats, isSortByOnline, onlineUsers]);
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Inbox</h1>
        <div className="flex space-x-2">
          <div className="p-2">
            <Mail size={20} />
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button onClick={() => setIsSortByOnline(false)} className={`px-4 py-2 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-lg ${isSortByOnline ? "" : "bg-gray-300 dark:bg-gray-700"}`}>All</button>
        <button onClick={() => setIsSortByOnline(true)} className={`px-4 py-2 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-lg ${isSortByOnline ? "bg-gray-300 dark:bg-gray-700" : ""}`}>Online</button>
      </div>

      <div className="space-y-2">
        {isUserChatsLoading && !userChats && <div className="flex pt-2 justify-center text-sm text-gray-400">Loading...</div>}
        {sortedChats.map((chat) => (
          <InboxListItem
            key={chat?._id}
            chat={chat}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};