import { useContext } from "react";
import { MessageSquare } from "lucide-react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { Avatar } from "./Avatar";

export const UserListItem = ({ user }) => {
const { user: currentUser } = useContext(AuthContext);
  const { onlineUsers, createChat, updateCurrentChat, userChats, setIsModalOpen } = useContext(ChatContext);

  const isOnline = onlineUsers?.some(
    (u) => u?.userId === user?._id
  );

  const existingChat = userChats?.find(chat => 
    chat.members.includes(currentUser?._id) && chat.members.includes(user?._id)
  );

  const handleClick = async () => {
    if (existingChat) {
      updateCurrentChat(existingChat);
    } else {
      const newChat = await createChat(currentUser?._id, user?._id);
      updateCurrentChat(newChat);
    }

    setIsModalOpen(false);
  }

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-lg cursor-pointer">
      <div className="flex items-center space-x-3 min-w-0">
        <Avatar avatarId={user?.avatarId} userId={user?._id} />
        <div>
          <h3 className="font-medium truncate whitespace-nowrap w-40">{user?.name}</h3>
          <div className="flex items-center text-xs">
            <span className="text-sm text-gray-500 dark:text-gray-400">{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <button className="p-1 hover:bg-gray-400 hover:dark:bg-gray-600 rounded" onClick={handleClick}>
        <MessageSquare size={16} />
      </button>
    </div>
  );
};