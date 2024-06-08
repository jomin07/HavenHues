import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../backend/src/shared/types"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";

type Props = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse;
    totalCost: number;
}

export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    extraBedCount: number;
    checkIn: string;
    checkOut: string;
    hotelID: string;
    paymentIntentId: string;
    totalCost: number;
}

const BookingForm = ({ currentUser, paymentIntent, totalCost }: Props) =>{
    const stripe = useStripe();
    const elements = useElements();

    const search = useSearchContext();
    const { hotelID } = useParams();

    const { showToast } = useAppContext();
    const navigate = useNavigate();

    const { mutate: bookRoom, isLoading } = useMutation(apiClient.createRoomBooking, {
        onSuccess: () =>{
            showToast({ message: "Booking Saved",type: "SUCCESS" }); 
            navigate("/")
        },
        onError: () =>{
            showToast({ message: "Error saving booking",type: "ERROR" });
        }
    })

    const { handleSubmit, register, setValue } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount: search.adultCount,
            childCount: search.childCount,
            extraBedCount: search.extraBedCount,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelID: hotelID,
            paymentIntentId: paymentIntent.paymentIntentId,
            totalCost: totalCost
        }
    });

    useEffect(() => {
        if (hotelID) {
            setValue("hotelID", hotelID);
        }
        setValue("totalCost", totalCost);
    }, [totalCost, setValue, hotelID]);

    const onSubmit = async (formData: BookingFormData) =>{
        if(!stripe || !elements){
            return;
        }
        const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement) as StripeCardElement 
            }
        });

        if(result.paymentIntent?.status === "succeeded"){
            bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
        }
    }

    return(
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
            <span className="text-3xl font-bold">Confirm Your Details</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input 
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("firstName")}  
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input 
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("lastName")}  
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input 
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("email")}  
                    />
                </label>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Your Price Summary</h2>
                <div className="bg-blue-200 p-4 rounded-md">
                    <div className="font-semibold text-lg">
                        Total Cost: ₹{totalCost.toFixed(2)}
                    </div>
                    <div className="text-xs">Includes taxes and charges</div>
                </div>
            </div>

            <div className="space-y-2">
                <h3>Payment Details</h3>
                <CardElement 
                    id="payment-element" 
                    className="border rounded-md p-2 text-sm"
                />
            </div>

            <div className="flex justify-end">
                <button
                    disabled={isLoading}
                    type="submit" 
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
                >
                    {isLoading ? "Saving..." : "Confirm Booking"}
                </button>
            </div>
        </form>
    )
}

export default BookingForm;