import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../components/Loader";

const MyHotels = () =>{
    const { data: hotelData, isLoading } = useQuery("fetchMyHotels", apiClient.fetchMyHotels, {
        onError: () =>{

        }
    });

    if(isLoading){
        return(
            <Loader loading={isLoading}/>
        );
    }

    if(!hotelData) {
        return(
            <div className="space-y-5">
                <span className="flex justify-between">
                    <h1 className="text-3xl font-bold">No Hotels Found</h1>
                    <Link to={"/add-hotel"} 
                        className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                    >
                        Add Hotel
                    </Link>
                </span>
            </div>
        );
    }

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return(
        <div className="space-y-5">
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">My Hotels</h1>
                <Link to={"/add-hotel"} 
                    className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                >
                    Add Hotel
                </Link>
            </span>
            <div className="grid grid-cols-1 gap-8">
                {hotelData.map((hotel) =>(
                    <div
                        className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
                    >
                        <h2 className="text-2xl font-bold">{hotel.name}</h2>
                        <div className="whitespace-pre-line">{hotel.description}</div>
                        <Slider {...sliderSettings}>
                            {hotel.imageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`${hotel.name} - ${index + 1}`}
                                    className="w-full h-64 object-cover rounded-md"
                                />
                            ))}
                        </Slider>
                        <div className="grid grid-cols-5 gap-2">
                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                            <BsMap className="mr-1" />
                            {hotel.city}, {hotel.country}
                        </div>
                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                            <BsBuilding className="mr-1" />
                            {hotel.type}
                        </div>
                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                            <BiMoney className="mr-1" />₹{hotel.pricePerNight} per night
                        </div>
                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                            <BiHotel className="mr-1" />
                            {hotel.adultCount} adults, {hotel.childCount} children
                        </div>
                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                            <BiStar className="mr-1" />
                            {hotel.starRating} Star Rating
                        </div>
                        </div>
                        <span className="flex justify-between">
                        <Link
                            to={`/edit-hotel/${hotel._id}`}
                            className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                        >
                            View Details
                        </Link>
                        <Link to={`/hotel-bookings/${hotel._id}`} 
                            className="flex bg-green-600 text-white text-xl font-bold p-2 hover:bg-green-500">
                            View Bookings
                        </Link>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyHotels;