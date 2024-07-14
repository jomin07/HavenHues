import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const onSubmit = async (data: { password: string }) => {
    try {
      if (token) {
        await apiClient.resetPassword({ token, password: data.password });
        showToast({ message: "Password has been reset!", type: "SUCCESS" });
        navigate("/sign-in");
      } else {
        showToast({ message: "Invalid token", type: "ERROR" });
      }
    } catch (error: any) {
      showToast({ message: error.message, type: "ERROR" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <h2 className="text-3xl font-bold">Reset Password</h2>

      <label className="text-gray-700 text-sm font-bold flex-1">
        New Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>

      <button
        type="submit"
        className="bg-blue-600 p-2 px-3 text-white font-bold hover:bg-blue-500 text-xl"
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
