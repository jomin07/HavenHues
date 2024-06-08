import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "../../store/store";

type Props = {
    hotelID: string;
    pricePerNight: number;
    extraBedCount: number;
    extraBedCharge: number;
    maxAdultCount: number;
}

type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    extraBedCount: number;
}

const GuestInfoForm = ({ hotelID, pricePerNight, extraBedCount, extraBedCharge, maxAdultCount }: Props) =>{
    const search = useSearchContext();
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const { watch, register, handleSubmit, setValue, formState:{ errors }, setError, clearErrors } = useForm<GuestInfoFormData>({ defaultValues: {
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        adultCount: search.adultCount,
        childCount: search.childCount,
        extraBedCount: 0
    }});

    const checkIn = watch("checkIn");
    const checkOut = watch("checkOut");
    const currentExtraBedCount = watch("extraBedCount"); 

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const onSignInClick = (data: GuestInfoFormData) =>{
        search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount, data.extraBedCount);
        navigate("/sign-in", { state: { from: location }});
    }
    
    const onSubmit = (data: GuestInfoFormData) =>{
        if (data.adultCount > maxAdultCount + data.extraBedCount) {
            setError("adultCount", { 
                type: "manual", 
                message: `Total adults should not exceed ${maxAdultCount + data.extraBedCount}`
            });
            return;
        }
        clearErrors("adultCount");
        search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount, data.extraBedCount);
        navigate(`/hotel/${hotelID}/booking`);
    }

    return(
        <div className="flex flex-col p-4 bg-blue-200 gap-4">
            <h3 className="text-md font-bold">₹{pricePerNight}</h3>
            <form 
                onSubmit={isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)}>
                <div className="grid grid-cols-1 gap-4 items-center">
                    <div>
                        <DatePicker 
                            required
                            selected={checkIn}
                            onChange={(date) => setValue("checkIn", date as Date)}
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-in Date"
                            className="min-w-full bg-white p-2 focus:outline-none"
                            wrapperClassName="min-w-full"
                        />
                    </div>
                    <div>
                        <DatePicker 
                            required
                            selected={checkOut}
                            onChange={(date) => setValue("checkOut", date as Date)}
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-out Date"
                            className="min-w-full bg-white p-2 focus:outline-none"
                            wrapperClassName="min-w-full"
                        />
                    </div>

                    <div className="flex bg-white px-2 py-1 gap-2">
                        <label className="items-center flex">
                            Adults:
                            <input 
                                className="w-full p-1 focus:outline-none font-bold" 
                                type="number" 
                                min={1}
                                max={20}
                                {...register("adultCount", {
                                    required: "This field is required",
                                    min: {
                                        value: 1,
                                        message: "There must be atleast one adult"
                                    },
                                    valueAsNumber: true
                                })}
                            />
                        </label>
                        <label className="items-center flex">
                            Children:
                            <input 
                                className="w-full p-1 focus:outline-none font-bold" 
                                type="number" 
                                min={0}
                                max={5}
                                {...register("childCount", {
                                    valueAsNumber: true
                                })}
                            />
                        </label>
                        {errors.adultCount && (
                            <span className="text-red-500 font-semibold text-sm">
                                {errors.adultCount.message}
                            </span>
                        )}
                    </div>

                    <div className="flex bg-white px-2 py-1 gap-2">
                        <label className="items-center flex">
                            Extra Beds:
                            <input
                                className="w-full p-1 focus:outline-none font-bold"
                                type="number"
                                min={0}
                                max={extraBedCount}
                                {...register("extraBedCount", {
                                    valueAsNumber: true
                                })}
                            />
                        </label>
                    </div>

                    {currentExtraBedCount > 0 && (
                        <div className="text-blue-600 font-semibold">
                            Extra Bed Charges: ₹{currentExtraBedCount * extraBedCharge}
                        </div>
                    )}
                    {isLoggedIn? (
                            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">Book Now</button>
                        ) : (
                            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">Sign In to Book</button>
                        )}
                </div>
            </form>
        </div>
    )
}

export default GuestInfoForm;