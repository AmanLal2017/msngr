import { useCallback, useEffect, useState } from "react";
import { createContext } from "react";
import { baseUrl, getRequest, postRequest } from "../layout/hooks/utils/service";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [messagesError, setMessagesError] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [potentialChats, setPotentialChats] = useState(null);
  const [currentChats, setCurrentChats] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    const newSocket = io("https://msngr-production.up.railway.app");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((Id) => Id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );

      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(error);
      }

      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      setIsUsersLoading(true);

      const response = await getRequest(`${baseUrl}/users`);

      setIsUsersLoading(false);
  
      if (response.error) {
        console.log("Error fetching users:", response);
        return;
      }
  
      setAllUsers(response);
  
      if (userChats && user) {
        const otherUsers = response.filter(u => u._id !== user._id).map(u => {
          const isChatCreated = userChats.some(
            chat => chat.members.includes(u._id)
          );

          return { ...u, isChatCreated };
        });

        setPotentialChats(otherUsers.filter(u => !u.isChatCreated));
        setCurrentChats(otherUsers.filter(u => u.isChatCreated));
      }
    };
  
    getUsers();
  }, [userChats, onlineUsers]);

  useEffect(() => {
    const getUserChats = async () => {
      setIsUserChatsLoading(true);
      setUserChatsError(null);

      if (user?._id) {
        const userId = user?._id;

        const response = await getRequest(`${baseUrl}/chats/${userId}`);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }

      setIsUserChatsLoading(false);
    };

    getUserChats();
  }, [user, notifications, messages]);

  const updateCurrentChat = useCallback(async (chat) => {
    setCurrentChat(chat);
  }, []);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You must type something...");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );

      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  const createChat = useCallback(async (senderId, receiverId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ senderId, receiverId })
    );

    if (response.error) {
      return console.log("Error creating chat:", response);
    }

    setUserChats((prev) => [...prev, response]);

    return response;
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const modifiedNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(modifiedNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      const readChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      const modifiedNotifications = notifications.map((element) => {
        if (n.senderId === element.senderId) {
          return { ...n, isRead: true };
        } else {
          return element;
        }
      });

      updateCurrentChat(readChat);
      setNotifications(modifiedNotifications);
      setIsModalOpen(false);
    },
    []
  );

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      const modifiedNotifications = notifications.map((element) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId === element.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = element;
          }
        });

        return notification;
      });

      setNotifications(modifiedNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        updateCurrentChat,
        currentChat,
        messages,
        messagesError,
        socket,
        sendTextMessage,
        sendTextMessageError,
        onlineUsers,
        isUsersLoading,
        potentialChats,
        currentChats,
        createChat,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
        newMessage,
        isMessagesLoading,
        isModalOpen,
        setIsModalOpen
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
