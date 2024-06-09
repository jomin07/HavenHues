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
    const { stripePromise, showToast } = useAppContext();
    const search = useSearchContext();
    const { hotelID } = useParams();

    const [numberOfNights, setNumberOfNights] = useState<number>(0);
    const [paymentIntentData, setPaymentIntentData] = useState<PaymentIntentResponse | null>(null);
    const [hotel, setHotel] = useState<HotelType | null>(null);

    const [couponCode, setCouponCode] = useState<string>('');
    const [discountedTotal, setDiscountedTotal] = useState<number | null>(null);
    const [couponError, setCouponError] = useState<string>('');

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

    const applyCoupon = async () => {
        if (!hotelID) {
            setCouponError('Hotel ID is missing');
            return;
        }
        if (!paymentIntentData) {
            setCouponError('Payment intent data is missing');
            return;
        }
        try {
            const response = await apiClient.applyCoupon(hotelID, couponCode, paymentIntentData?.paymentIntentId);
            setDiscountedTotal(response.totalCost);
            setCouponError('');
            showToast({ message: "Coupon Applied Successfully", type: "SUCCESS" });
        } catch (error) {
            setCouponError('Invalid coupon code or failed to apply coupon');
            showToast({ message: "Failed to Apply Coupon",type: "ERROR" });
        }
    };

    const { data: currentUser } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);
    
    if(!hotel){
        return(
            <></>
        )
    }
    
    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            <div>
                <BookingDetailsSummary 
                    checkIn={search.checkIn} 
                    checkOut= {search.checkOut} 
                    adultCount={search.adultCount}
                    childCount={search.childCount}
                    extraBedCount={search.extraBedCount}
                    numberOfNights={numberOfNights}
                    hotel={hotel}
                />
                <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border p-2 rounded my-4 mx-2"
                />
                <button onClick={applyCoupon} className="ml-2 p-2 bg-blue-600 text-white rounded">Apply Coupon</button>
                {couponError && <p className="text-red-500 font-semibold text-sm my-4 mx-2">{couponError}</p>}
                <div className="my-4 mx-2">
                    <h2 className="text-xl font-bold mt-4">Total Cost: ₹{discountedTotal !== null ? discountedTotal.toFixed(2) : (paymentIntentData?.totalCost.toFixed(2) ?? 'Calculating...')}</h2>
                </div>
            </div>
            

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
                        totalCost={discountedTotal !== null ? discountedTotal : paymentIntentData.totalCost} 
                    />
                </Elements>
            )}
        </div>
    );
}

export default Booking;