import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HotelType } from '../../../../backend/src/shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Hotels = () => {
    const [hotels, setHotels] = useState<HotelType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/admin/hotels`)
            .then(response => setHotels(response.data))
            .catch(error => console.error(error));
    }, []);

    const toggleHotelStatus = async (id: string) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/admin/hotels/${id}/toggle-status`);
            setHotels(hotels.map(hotel => 
                hotel._id === id ? { ...hotel, isBlocked: response.data.hotel.isBlocked } : hotel
            ));
        } catch (error) {
            console.error('Error toggling hotel status:', error);
        }
    };

    const viewRequest = (id: string) => {
        navigate(`/admin/hotels/${id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="py-4 mb-6">
                <h1 className="text-3xl font-bold">Hotels</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">City</th>
                            <th className="py-3 px-6 text-left">Country</th>
                            <th className="py-3 px-6 text-left">Approval Status</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotels.map(hotel => (
                            <tr key={hotel._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-6">{hotel.name}</td>
                                <td className="py-3 px-6">{hotel.city}</td>
                                <td className="py-3 px-6">{hotel.country}</td>
                                <td className="py-3 px-6">{hotel.approvalStatus}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex justify-center space-x-2">
                                        {hotel.approvalStatus === 'Pending' ? (
                                            <button
                                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => viewRequest(hotel._id)}
                                            >
                                                View Request
                                            </button>
                                        ) : (
                                            <button
                                                className={`${
                                                    hotel.isBlocked ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
                                                } text-white font-bold py-2 px-6 rounded`}
                                                onClick={() => toggleHotelStatus(hotel._id)}
                                            >
                                                {hotel.isBlocked ? 'Unblock' : 'Block'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Hotels;
