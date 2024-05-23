import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

export type OtpFormData = {
    email: string;
    otp: string;
}

const VerifyOtp = () =>{
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    const { register,watch,handleSubmit,formState: { errors } } = useForm<OtpFormData>();

    const verifyOtpMutation = useMutation(apiClient.verifyOtp, {
        onSuccess:async () => {
            showToast({ message: "OTP verified successfully!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        }
    });

    const resendOtpMutation = useMutation(apiClient.resendOtp, {
        onSuccess: () => {
            showToast({ message: "OTP resent successfully!", type: "SUCCESS" });
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        }
    });

    const onSubmit = handleSubmit((data) => {
        console.log('Form Data:', data);
        verifyOtpMutation.mutate(data);
    });

    const handleResendOtp = () => {
        const email = watch("email");
        if (email) {
            resendOtpMutation.mutate({ email });
        } else {
            showToast({ message: "Please enter your email first", type: "ERROR" });
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Verify OTP</h2>

            <label className="text-gray-700 text-sm font-bold">
                Email
                <input
                    type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", { required: "This field is required" })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>

            <label className="text-gray-700 text-sm font-bold">
                OTP
                <input
                    type="text"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("otp", { required: "This field is required" })}
                />
                {errors.otp && (
                    <span className="text-red-500">{errors.otp.message}</span>
                )}
            </label>

            <button
                type="submit"
                className="bg-blue-600 p-2 text-white font-bold hover:bg-blue-500 text-xl"
            >
                Verify OTP
            </button>

            <button
                type="button"
                onClick={handleResendOtp}
                className="bg-gray-600 p-2 text-white font-bold hover:bg-gray-500 text-xl mt-2"
            >
                Resend OTP
            </button>
        </form>
    );
}

export default VerifyOtp;