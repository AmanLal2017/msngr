import { useRef, useState, useEffect } from "react";
import { useContext } from "react";
import moment from "moment";
import { Send } from "lucide-react"
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { useFetchRecipientUser } from "./hooks/useFetchRecipient";
import { Message } from "./components/Message"
import { Avatar } from "./components/Avatar";

export const ChatArea = () => {
  const { user } = useContext(AuthContext);
  const { onlineUsers, currentChat, messages, sendTextMessage, isMessagesLoading } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  if (!recipientUser)
    return (
      <p className="flex-1 flex items-center pb-8 justify-center text-gray-400">
        No conversation selected
      </p>
    );

  if (isMessagesLoading)
    return (
      <p className="flex-1 flex items-center pb-8 justify-center text-gray-400">Loading chat...</p>
    );

  const handleInputChange = (e) => {
    setTextMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (textMessage.trim() !== '') {
      sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* header */}
      <div className="h-16 flex items-center px-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar avatarId={recipientUser?.avatarId} userId={recipientUser?._id} />
          <div>
            <h2 className="font-semibold">{recipientUser?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>
      </div>
  
      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="space-y-4">
          {messages &&
            messages?.map((message, index) => (  
              <Message
                key={index}
                content={message.text}
                time={moment(message.createdAt).calendar()}
                isOwn={message?.senderId === user?._id}
              />
          ))}
          <div ref={scroll} />
        </div>
      </div>
  
      {/* input */}
      <div className="sticky bottom-0 z-10 p-4 bg-white dark:border-gray-700 dark:bg-gray-900 mb-16 md:mb-0">
        <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 rounded-lg p-2">
          <input
            value={textMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            type="text"
            placeholder="Type message..."
            className="flex-1 bg-transparent outline-none"
          />
          <button className="p-2 rounded-full" onClick={handleSendMessage}>
            <Send size={20} className={textMessage.trim() === '' ? "text-gray-600 dark:text-gray-300" : "text-gray-800 dark:text-gray-50"}/>
          </button>
        </div>
      </div>
    </div>
  );
};  