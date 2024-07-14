import axios from "axios";
import { useEffect, useState } from "react";
import { useChatContext } from "../../contexts/ChatContext";
import { useToast } from "@chakra-ui/react";
import { Box, Stack, Text } from "@chakra-ui/layout";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface MyChatsProps {
  fetchAgain: boolean;
}

const MyChats = ({ fetchAgain }: MyChatsProps) => {
  const [loggedUser, setLoggedUser] = useState();
  const userInfo = localStorage.getItem("userInfo");
  const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;

  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useChatContext();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/chat`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(parsedUserInfo);
    fetchChats();
  }, [fetchAgain]);

  const handleChatSelect = (chat: any) => {
    setSelectedChat(chat);
    setNotification(
      notification.filter((notif) => notif.chat._id !== chat._id)
    );
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => handleChatSelect(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
