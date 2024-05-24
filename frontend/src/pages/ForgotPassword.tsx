import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useMutation } from "react-query";

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();
    const { showToast } = useAppContext();

    const mutation = useMutation(apiClient.requestPasswordReset, {
        onSuccess: async () =>{
            showToast({ message: "Password reset email sent!", type: "SUCCESS" });
        },
        onError: (error: Error) =>{
            showToast({ message: error.message,type: "ERROR" });
        }
    });

    const onSubmit = handleSubmit((data) =>{
        mutation.mutate(data);
    })

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold">Forgot Password</h2>

            <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input type="email" className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", { required: "This field is required" })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>

            <button type="submit" className="bg-blue-600 p-2 px-3 text-white font-bold hover:bg-blue-500 text-xl">
                Send Reset Email
            </button>
        </form>
    );
}

export default ForgotPassword;
