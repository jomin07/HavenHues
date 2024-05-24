import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useEffect, useRef, useState } from "react";

export type OtpFormData = {
    email: string;
    otp: string;
}

const VerifyOtp = () =>{
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    const { handleSubmit,setError,clearErrors,formState: { errors } } = useForm<OtpFormData>();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [timer, setTimer] = useState<number>(() => {
        const savedTimer = localStorage.getItem('otp-timer');
        return savedTimer ? parseInt(savedTimer, 10) : 60;
    });

    useEffect(() => {
        // Function to decrement timer every second
        const decrementTimer = () => {
            if (timer > 0) {
                setTimer((prevTimer) => {
                    const newTimer = prevTimer - 1;
                    localStorage.setItem('otp-timer', newTimer.toString());
                    return newTimer;
                });
            }
        };

        // Start the timer when the component mounts
        const intervalId: NodeJS.Timeout = setInterval(decrementTimer, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [timer]);

    const verifyOtpMutation = useMutation(apiClient.verifyOtp, {
        onSuccess:async () => {
            showToast({ message: "OTP verified successfully!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            localStorage.removeItem('email');
            localStorage.removeItem('otp-timer');
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

    const handleOtpChange = (element: HTMLInputElement, index: number) => {
        const value = element.value;
        if (/[^0-9]/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every(digit => digit !== "")) {
            clearErrors("otp");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === 'Backspace' && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const onSubmit = handleSubmit(() => {
        const email = localStorage.getItem('email');
        const otpString = otp.join('');
        if (otpString.length < 6) {
            setError("otp", { type: "manual", message: "This field is required" });
            return;
        }
        if (email) {
            verifyOtpMutation.mutate({ email, otp: otpString });
        } else {
            showToast({ message: "Email not found, please register again", type: "ERROR" });
            navigate("/register");
        }
    });

    const handleResendOtp = () => {
        const email = localStorage.getItem('email');
        if (email) {
            resendOtpMutation.mutate({ email });
            // Reset timer to 60 seconds
            setTimer(60);
        } else {
            showToast({ message: "Email not found, please register again", type: "ERROR" });
        }
    };

    return (
        <form className="flex flex-col gap-5 items-center" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Verify OTP</h2>

            <p>Timer: {timer} seconds</p>

            <div className="flex justify-center gap-2 mt-3 mb-6">
                {otp.map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="border border-black rounded w-12 h-12 text-center text-xl font-normal"
                    />
                ))}
            </div>
            {errors.otp && (
                <span className="text-red-500">{errors.otp.message}</span>
            )}
            

            <button
                type="submit"
                className=" bg-blue-600 py-2 px-4 text-white font-bold hover:bg-blue-500 text-xl"
            >
                Verify OTP
            </button>

            <button
                type="button"
                onClick={handleResendOtp}
                className="bg-gray-600 py-2 px-3 text-white font-bold hover:bg-gray-500 text-xl mt-2"
            >
                Resend OTP
            </button>
        </form>
    );
}

export default VerifyOtp;