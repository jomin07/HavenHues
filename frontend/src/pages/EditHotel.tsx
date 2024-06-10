import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () =>{
    const { hotelID } = useParams();
    const { showToast } = useAppContext();
    const navigate = useNavigate();

    const { data: hotel } = useQuery(
        "fetchMyHotelByID", () => apiClient.fetchMyHotelById(hotelID || ' '),
        {
            enabled: !!hotelID
        }
    );

    const { mutate,isLoading } = useMutation(apiClient.updateMyHotelById,{
        onSuccess: () =>{
            showToast({ message: "Hotel Details Updated",type: "SUCCESS"});
            navigate("/my-hotels");
        },
        onError: () =>{
            showToast({ message: "Error Updating Hotel", type: "ERROR"});
        }
    });

    const handleSave = (hotelFormData: FormData) =>{
        mutate(hotelFormData);
    }

    return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading}/>
}

export default EditHotel;