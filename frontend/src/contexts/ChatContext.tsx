import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../../../backend/src/shared/types";
import Loader from "../components/Loader";

type ChatContext = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  selectedChat: any;
  setSelectedChat: (chat: any) => void;
  chats: any[];
  setChats: (chats: any[]) => void;
  notification: any[];
  setNotification: (notification: any[]) => void;
  loading: boolean;
};

const ChatContext = React.createContext<ChatContext | undefined>(undefined);

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [notification, setNotification] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
        setUser(userInfo);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const contextValue: ChatContext = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    loading,
  };
  return (
    <ChatContext.Provider value={contextValue}>
      {loading ? <Loader loading={true} /> : children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  return context as ChatContext;
};
