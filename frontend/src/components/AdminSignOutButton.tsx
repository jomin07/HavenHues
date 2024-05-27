import { useMutation, useQueryClient } from "react-query";
import * as apiAdmin from "../api-admin";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const AdminSignOutButton = () =>{
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();

    const mutation = useMutation(apiAdmin.AdminSignOut, {
        onSuccess: async () =>{
            await queryClient.invalidateQueries("validateAdminToken");
            showToast({ message: "Signed Out!",type: "SUCCESS" });
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