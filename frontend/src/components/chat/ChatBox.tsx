import { Box } from "@chakra-ui/layout";
import { useChatContext } from "../../contexts/ChatContext";
import SingleChat from "./SingleChat";

interface ChatBoxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatBox = ({ fetchAgain, setFetchAgain }: ChatBoxProps) => {
  const { selectedChat } = useChatContext();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
