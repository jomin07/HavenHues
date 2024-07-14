import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserType } from "../shared/types";
import { useForm } from "react-hook-form";
import Loader from "../components/Loader";
import { useAppContext } from "../contexts/AppContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  mobile: string;
};

const Profile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUser(response.data);
      setLoading(false);
      setValue("firstName", response.data.firstName);
      setValue("lastName", response.data.lastName);
      setValue("mobile", response.data.mobile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/update`,
        { ...user, ...data },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      message: "Referral code copied to clipboard",
      type: "SUCCESS",
    });
  };

  if (loading) {
    return <Loader loading={loading} />;
  }

  if (!user) {
    return <div>Error fetching profile</div>;
  }

  return (
    <div className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div className="flex justify-between items-center">
            <Link
              to="/wallet"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Go to Wallet
            </Link>
            <Link
              to="/subscription"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
            >
              Subsription Plan
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-lg mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={user.email}
                className="w-full border rounded-lg p-2"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-1">First Name:</label>
              <input
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full border rounded-lg p-2"
              />
              {errors.firstName && (
                <span className="text-red-500 font-semibold text-sm">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-1">Last Name:</label>
              <input
                type="text"
                {...register("lastName", { required: "Last name is required" })}
                className="w-full border rounded-lg p-2"
              />
              {errors.lastName && (
                <span className="text-red-500 font-semibold text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-1">Mobile:</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                {...register("mobile", {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid mobile number",
                  },
                })}
              />
              {errors.mobile && (
                <span className="text-red-500 font-semibold text-sm">
                  {errors.mobile.message}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-lg mb-1">Referral Code:</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={user.referralCode}
                  className="w-full border rounded-lg p-2 mr-2"
                  readOnly
                />
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                  onClick={() => copyToClipboard(user.referralCode)}
                >
                  Copy
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
