import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";
import { HotelType, PaymentIntentResponse } from "../../../backend/src/shared/types";

const Booking = () =>{
    const { stripePromise } = useAppContext();
    const search = useSearchContext();
    const { hotelID } = useParams();

    const [numberOfNights, setNumberOfNights] = useState<number>(0);
    const [paymentIntentData, setPaymentIntentData] = useState<PaymentIntentResponse | null>(null);
    const [hotel, setHotel] = useState<HotelType | null>(null);

    useEffect(() =>{
        if(search.checkIn && search.checkOut){
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime())/
            (1000 * 60 * 60 * 24);

            setNumberOfNights(Math.ceil(nights));
        }
    },[search.checkIn, search.checkOut]);

    const fetchPaymentIntentData = useCallback(async () => {
        if (hotelID && numberOfNights > 0) {
            const paymentIntent = await apiClient.createPaymentIntent(
                hotelID,
                numberOfNights.toString(),
                search.extraBedCount.toString()
            );
            setPaymentIntentData(paymentIntent);
        }
    }, [hotelID, numberOfNights, search.extraBedCount]);

    const fetchHotelData = useCallback(async () => {
        if (hotelID) {
            const hotelData = await apiClient.fetchHotelById(hotelID);
            setHotel(hotelData);
        }
    }, [hotelID]);

    useEffect(() => {
        fetchPaymentIntentData();
    }, [fetchPaymentIntentData]);

    useEffect(() => {
        fetchHotelData();
    }, [fetchHotelData]);

    const { data: currentUser } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);
    
    if(!hotel){
        return(
            <></>
        )
    }
    
    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            <BookingDetailsSummary 
                checkIn={search.checkIn} 
                checkOut= {search.checkOut} 
                adultCount={search.adultCount}
                childCount={search.childCount}
                extraBedCount={search.extraBedCount}
                numberOfNights={numberOfNights}
                hotel={hotel}
            />
            {currentUser && paymentIntentData && (
                <Elements 
                    stripe={stripePromise} 
                    options={{
                        clientSecret: paymentIntentData.clientSecret
                    }}
                >
                    <BookingForm
                        currentUser={currentUser}
                        paymentIntent={paymentIntentData} 
                    />
                </Elements>
            )}
        </div>
    );
}

export default Booking;