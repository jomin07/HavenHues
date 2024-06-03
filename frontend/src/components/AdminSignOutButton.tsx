import { useMutation, useQueryClient } from "react-query";
import * as apiAdmin from "../api-admin";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "../store/slices/authSlice";

const AdminSignOutButton = () =>{
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();
    const dispatch = useDispatch();

    const mutation = useMutation(apiAdmin.AdminSignOut, {
        onSuccess: async () =>{
            showToast({ message: "Signed Out!",type: "SUCCESS" });
            dispatch(adminLogout());
            await queryClient.invalidateQueries("validateAdminToken");
            navigate("/admin");
        },
        onError: (error: Error) =>{
            showToast({ message: error.message,type: "ERROR" });
        }
    });

    const handleClick = () =>{
        mutation.mutate();
    };

    return (
        <button 
            onClick={handleClick} className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600">Sign Out
        </button>
    );
}

export default AdminSignOutButton;