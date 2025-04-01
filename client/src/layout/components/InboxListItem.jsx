import { useContext } from "react";
import moment from "moment";
import { ChatContext } from "../../context/ChatContext";
import { useFetchLatestMessage } from "../hooks/useFetchLatestMessage";
import { useFetchRecipientUser } from "../hooks/useFetchRecipient";
import { Avatar } from "./Avatar";

export const InboxListItem = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { latestMessage } = useFetchLatestMessage(chat);
  const { notifications, markThisUserNotificationsAsRead, updateCurrentChat, setIsModalOpen } =
    useContext(ChatContext);
    
  const unreadNotifications = notifications.filter((n) => n.isRead === false);
  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId == recipientUser?._id
  );

  const truncateText = (text) => {
    let shortText = text.substring(0, 20);

    if (text.length > 20) {
      shortText = shortText + "...";
    }

    return shortText;
  };

  const hasUnread = thisUserNotifications.length === 0 ? false : true

  const handleClick = () => {
    updateCurrentChat(chat);
    setIsModalOpen(false);

    if (hasUnread) {
      markThisUserNotificationsAsRead(
        thisUserNotifications,
        notifications
      );
    }
  }

  return (
    <div className="flex items-center space-x-3 p-2 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-lg cursor-pointer" onClick={handleClick}>
      <Avatar avatarId={recipientUser?.avatarId} userId={recipientUser?._id} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate whitespace-nowrap flex-1">
            {recipientUser?.name}
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0 text-right">
            {latestMessage ? moment(latestMessage?.createdAt).fromNow() : ""}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
            {latestMessage?.text}
          </p>
          {hasUnread && (
            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 ml-2" />
          )}
        </div>
      </div>
    </div>
  );
};