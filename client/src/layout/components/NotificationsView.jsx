import { Bell } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { NotificationListItem } from "./NotificationListItem";

export const NotificationsView = () => {
  const { user } = useContext(AuthContext);
  const {
    notifications,
    allUsers,
    markAllNotificationsAsRead,
    userChats,
    markNotificationAsRead,
  } = useContext(ChatContext);

  const unreadNotifications = notifications.filter((n) => n.isRead === false);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      avatarId: sender?.avatarId,
      senderName: sender?.name,
    };
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Notifications</h1>
          <div className="p-2">
            <Bell size={20} />
          </div>
      </div>

      <div className="flex space-x-2 mb-4">
        <button 
          className="w-full py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 hover:dark:bg-gray-600 rounded-lg"
          onClick={() => markAllNotificationsAsRead(notifications)}
        >
          Mark all as read
        </button>
      </div>
      
      <div className="space-y-3">
        {modifiedNotifications.map((notification, index) => (
          <NotificationListItem 
            key={index}
            notification={notification}
            onClick={() => markNotificationAsRead(notification, userChats, user, notifications)}
          />
        ))}
      </div>
    </div>
  );
};