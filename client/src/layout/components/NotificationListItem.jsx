import moment from "moment";
import { Avatar } from "./Avatar";

export const NotificationListItem = ({ notification, onClick }) => (
  <div 
    className="flex p-3 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-150"
    onClick={onClick}
  >
    <div className="mr-3 self-center">
      <Avatar avatarId={notification?.avatarId} onlineDisabled />
    </div>

    <div className="flex flex-col flex-1 min-w-0">
      <div className="flex justify-between items-center w-full mb-0.5">
        <h3 className="font-medium truncate">{notification.senderName}</h3>
        <span className="text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
          {moment(notification.date).fromNow()}
        </span>
      </div>

      <div className="flex justify-between items-center w-full">
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">just sent you a message</p>
        <div className="ml-2 flex-shrink-0 w-2 self-center">
          {!notification.isRead && (
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-0.5" />
          )}
        </div>
      </div>
    </div>
  </div>
);