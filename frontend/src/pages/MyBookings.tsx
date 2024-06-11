import { useQuery } from "react-query";
import * as apiClient from "../api-client"
import { useState } from "react";
import CancelBookingModal from "../components/modals/CancelBookingModal";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import Loader from "../components/Loader";


const MyBookings = () =>{
    const { data: hotels, isLoading } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBookingID, setSelectedBookingID] = useState<string | null>(null);
    const navigate = useNavigate();
    const { showToast } = useAppContext();

    const handleCancelBooking = async (bookingID: string, cancellationReason: string) => {
        try {
            await apiClient.cancelBooking( bookingID, cancellationReason );
            showToast({ message: "Booking Cancelled",type: "SUCCESS"});
            navigate("/");
        } catch (error) {
            console.error("Error cancelling booking:", error);
            showToast({ message: "Cancellation Failed", type: "ERROR"});
        }
    };

    const openModal = (bookingID: string) => {
        setSelectedBookingID(bookingID);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBookingID(null);
    };

    const submitCancellationReason = (reason: string) => {
        if (selectedBookingID) {
            handleCancelBooking(selectedBookingID, reason);
        }
        closeModal();
    };

    if(!hotels || hotels.length === 0){
        return (
            <h1 className="text-3xl font-bold">No Bookings Found</h1>
        )
    }

    if(isLoading){
        return(
            <Loader loading={isLoading}/>
        );
      }

    return(
        <div className="space-y-5">
            <h1 className="text-3xl font-bold">My Bookings</h1>
            {hotels.map((hotel) =>(
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
                    <div className="lg:w-full lg:h-[250px]">
                        <img 
                            src={hotel.imageUrls[0]} 
                            alt={hotel.name}
                            className="w-full h-full object-cover object-center" 
                        />
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                        <div className="text-2xl font-bold">
                            {hotel.name}
                            <div className="text-xs font-normal">
                                {hotel.city}, {hotel.country}
                            </div>
                        </div>
                        {hotel.bookings.map((booking) =>(
                            <div>
                                <div>
                                    <span className="font-bold mr-2">Dates:</span>
                                    <span>
                                        {new Date(booking.checkIn).toDateString()}-
                                        {new Date(booking.checkOut).toDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-bold mr-2">Guests:</span>
                                    <span>
                                        {booking.adultCount} adults, {booking.childCount} children
                                    </span>
                                </div>
                                <div>
                                    <span className="font-bold mr-2">Status:</span>
                                    <span>{booking.status}</span>
                                </div>
                                {booking.status === 'Completed' && (
                                    <button
                                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 my-3 rounded"
                                        onClick={() => openModal(booking._id)}
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <CancelBookingModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={submitCancellationReason}
            />
        </div>
    );
}

export default MyBookings;