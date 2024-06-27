import { useEffect, useState } from "react";
import basic from "../assets/basic.svg";
import pro from "../assets/pro.svg";
import business from "../assets/business.svg";
import axios from "axios";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const data = [
  {
    id: 1,
    src: basic,
    title: "Basic",
    price: "0",
    stripePriceId: "price_basic",
  },
  {
    id: 2,
    src: pro,
    title: "Pro",
    price: "499",
    stripePriceId: "price_pro",
  },
  {
    id: 3,
    src: business,
    title: "Business",
    price: "999",
    stripePriceId: "price_business",
  },
];
const Subscription = () => {
  const [planType, setPlanType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/users/subscription`,
          {
            withCredentials: true,
          }
        );
        setPlanType(response.data.subscriptionPlan);
      } catch (error) {
        console.error("Error fetching user subscription plan:", error);
      }
    };

    fetchUserPlan();
  }, []);

  const { data: currentUser, isLoading } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  const handleCheckout = (plan) => {
    navigate(`/checkout/${plan.id}`, { state: { plan, currentUser } });
  };

  return (
    <>
      <h2 className="text-4xl font-bold mb-6">Subscription Plan</h2>
      <div className="flex flex-col items-center w-full mx-auto min-h-screen diagonal-background overflow-x-hidden bg-blue-700">
        <div
          className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 z-50 place-items-center w-9/12 mx-auto
        mt-20"
        >
          {data.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white px-6 py-8 rounded-xl text-[#4f7cff] w-full mx-auto grid 
              place-items-center ${
                planType === item.title.toLowerCase() &&
                "border-[16px] border-green-400"
              }`}
            >
              <img
                src={item.src}
                alt=""
                width={200}
                height={200}
                className="h-40"
              />
              <div className="text-4xl text-slate-700 text-center py-4 font-bold">
                {item.title}
              </div>
              <p className="lg:text-sm text-xs text-center px-6 text-slate-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Dignissimos quaerat dolore sit eum quas non mollitia
                reprehenderit repudiandae debitis tenetur?
              </p>
              <div className="text-4xl text-center font-bold py-4">
                ₹{item.price} <span className="text-lg">/month</span>
              </div>
              <div className="mx-auto flex justify-center items-center my-3">
                {planType === item.title.toLowerCase() ? (
                  <button className="bg-green-600 text-white rounded-md text-base uppercase w-auto py-2 px-4 font-bold">
                    Subscribed
                  </button>
                ) : (
                  <button
                    onClick={() => handleCheckout(item)}
                    className="bg-[#3d5fc4] text-white rounded-md text-base uppercase w-24 py-2 font-bold"
                  >
                    Start
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Subscription;
