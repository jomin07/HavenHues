import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { HotelType } from '../../../../backend/src/shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HotelDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [hotel, setHotel] = useState<HotelType | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/admin/hotels/${id}`)
            .then(response => setHotel(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const approveHotel = async () => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/hotels/${id}/approve`);
            navigate('/admin/hotels');
        } catch (error) {
            console.error('Error approving hotel:', error);
        }
    };

    if (!hotel) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className='flex justify-between'>
                <h1 className="text-3xl font-bold mb-6">{hotel.name}</h1>
                <button
                    onClick={() => navigate('/admin/hotels')}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 hover:bg-blue-400"
                >
                    Back to Hotel List
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="max-h-96 overflow-y-auto">
                        {hotel.imageUrls.map((url, index) => (
                            <img key={index} src={url} alt={hotel.name} className="rounded-lg mb-4 w-full" />
                        ))}
                    </div>
                    <div className='p-4'>
                        <h4 className="text-xl font-bold mb-6">Hotel Details</h4>
                        <p className="mb-2"><strong>City:</strong> {hotel.city}</p>
                        <p className="mb-2"><strong>Country:</strong> {hotel.country}</p>
                        <p className="mb-2"><strong>Description:</strong> {hotel.description}</p>
                        <p className="mb-2"><strong>Type:</strong> {hotel.type}</p>
                        <p className="mb-2"><strong>Price Per Night:</strong> ₹{hotel.pricePerNight}</p>
                        <p className="mb-2"><strong>Star Rating:</strong> {hotel.starRating}</p>
                        <p className="mb-2"><strong>Facilities:</strong> {hotel.facilities.join(', ')}</p>
                        <p className="mb-2"><strong>Extra Bed Count:</strong> {hotel.extraBedCount}</p>
                        <p className="mb-2"><strong>Extra Bed Charge:</strong> ₹{hotel.extraBedCharge}</p>
                        <p className="mb-2"><strong>Approval Status:</strong> {hotel.approvalStatus}</p>
                        <div className="flex space-x-2 mt-4">
                            {hotel.approvalStatus === 'Pending' && (
                                <button
                                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
                                    onClick={approveHotel}
                                >
                                    Approve
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
