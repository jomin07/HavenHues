import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const GuestSection = () =>{
    const { register,formState: { errors }, watch } = useFormContext<HotelFormData>();
    const extraBedCount = watch("extraBedCount");

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Guests</h2>
            <div className="grid grid-cols-2 p-6 gap-5 bg-gray-300">

                <label className="text-gray-700 text-sm font-semibold">
                    Adults
                    <input
                        className="border rounded w-full py-2 px-3 font-normal"
                        type="number"
                        min={1}
                        {...register("adultCount", { 
                            required: "This field is required" 
                        })}
                    />
                    {errors.adultCount && (
                        <span className="text-red-500 text-sm font-bold">{errors.adultCount.message}</span>
                    )}
                </label>

                <label className="text-gray-700 text-sm font-semibold">
                    Children
                    <input
                        className="border rounded w-full py-2 px-3 font-normal"
                        type="number"
                        min={0}
                        {...register("childCount", { 
                            required: "This field is required" 
                        })}
                    />
                    {errors.childCount && (
                        <span className="text-red-500 text-sm font-bold">{errors.childCount.message}</span>
                    )}
                </label>

                <label className="text-gray-700 text-sm font-semibold">
                    Extra Beds
                    <input
                        className="border rounded w-full py-2 px-3 font-normal"
                        type="number"
                        min={0}
                        {...register("extraBedCount", { 
                            required: "This field is required" 
                        })}
                    />
                    {errors.extraBedCount && (
                        <span className="text-red-500 text-sm font-bold">{errors.extraBedCount.message}</span>
                    )}
                </label>

                {extraBedCount > 0 && (
                    <label className="text-gray-700 text-sm font-semibold">
                        Extra Bed Charge
                        <input
                            className="border rounded w-full py-2 px-3 font-normal"
                            type="number"
                            min={0}
                            {...register("extraBedCharge", { 
                                required: extraBedCount > 0 && "This field is required"
                            })}
                        />
                        {errors.extraBedCharge && (
                            <span className="text-red-500 text-sm font-bold">{errors.extraBedCharge.message}</span>
                        )}
                    </label>
                )}
            </div>
        </div>
    );
}

export default GuestSection;