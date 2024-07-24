import { useChatContext } from "../contexts/ChatContext";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/chat/SideDrawer";
import MyChats from "../components/chat/MyChats";
import ChatBox from "../components/chat/ChatBox";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatPage = () => {
  const location = useLocation();
  const userId = location.state?.userId;

  const { user, setUser, setSelectedChat, chats, setChats } = useChatContext();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [setUser]);

  useEffect(() => {
    const accessChat = async () => {
      try {
        if (!user) return;

        // Check if chat already exists
        const { data: existingChats } = await axios.get(
          `${API_BASE_URL}/api/chat`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (userId) {
          const chat = existingChats.find(
            (chat: { users: { _id: string }[] }) =>
              chat.users.some((u: { _id: string }) => u._id === userId)
          );

          if (chat) {
            setSelectedChat(chat);
          } else {
            // Create new chat if not existing
            const { data: newChat } = await axios.post(
              `${API_BASE_URL}/api/chat`,
              { userId },
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            setChats([newChat, ...chats]);
            setSelectedChat(newChat);
          }
        }
      } catch (error) {
        console.error("Error starting chat", error);
      }
    };

    accessChat();
  }, [user, userId]);

  if (!user) return <div></div>;

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="71.5vh"
        p="10px"
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
