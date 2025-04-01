import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import avatar from "./assets/avatar.svg";
import avatar2 from "./assets/avatar2.svg";
import avatar3 from "./assets/avatar3.svg";
import avatar4 from "./assets/avatar4.svg";
import avatar5 from "./assets/avatar5.svg";

const AVATAR_OPTIONS = [
  avatar,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
];

export const Avatar = ({ avatarId, userId, onlineDisabled }) => {
  const { onlineUsers } = useContext(ChatContext);
  const isOnline = userId ?
    onlineUsers?.some((user) => user?.userId === userId) :
    false;

  return (
    <div className="relative w-10 h-10 bg-gray-600 rounded-full flex-shrink-0">
      <img src={AVATAR_OPTIONS[avatarId]} alt="avatar" className="w-full h-full rounded-full" />
      {!onlineDisabled && isOnline && (
        <div className="h-4 w-4 rounded-full bg-green-400 absolute -top-1 -right-1" />
    )}
    </div>
  )
}