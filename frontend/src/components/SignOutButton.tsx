import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useChatContext } from "../contexts/ChatContext";

const SignOutButton = () => {
  const { setUser, setSelectedChat, setChats, setNotification } =
    useChatContext();

  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const dispatch = useDispatch();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Signed Out!", type: "SUCCESS" });
      setUser(null);
      setSelectedChat(null);
      setChats([]);
      setNotification([]);
      dispatch(logout());
      localStorage.removeItem("userInfo");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
