import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../../../backend/src/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SelectedPlan {
  id: number;
  src: string;
  title: string;
  price: string;
  stripePriceId: string;
}

interface SubscriptionCheckoutProps {
  selectedPlan: SelectedPlan;
  currentUser: UserType;
}

const CheckoutForm = ({
  selectedPlan,
  currentUser,
}: SubscriptionCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState(currentUser.email);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      showToast({ message: "Please enter your card details.", type: "ERROR" });
      return;
    }

    try {
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          email,
        },
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/users/create-subscription`,
        {
          email,
          paymentMethod,
          planId: selectedPlan.stripePriceId,
          price: selectedPlan.price,
        }
      );

      const { client_secret } = response.data;
      const confirmationResult = await stripe.confirmCardPayment(client_secret);

      if (confirmationResult.error) {
        showToast({
          message: "Failed to subscribe",
          type: "ERROR",
        });
        return;
      }

      showToast({ message: "Subscription successful!", type: "SUCCESS" });
      navigate("/subscription");
    } catch (error) {
      console.error("Error during subscription:", error);
      showToast({ message: "Subscription failed", type: "ERROR" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto bg-white p-8 mt-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Subscription Details</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={currentUser.firstName}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={currentUser.lastName}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile
          </label>
          <input
            id="mobile"
            type="text"
            value={currentUser.mobile}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200"
          />
        </div>
      </div>
      <div className="my-4">
        <h3 className="text-2xl font-semibold">{selectedPlan.title} Plan</h3>
        <p className="text-xl font-semibold mt-2">
          Price: ₹{selectedPlan.price} /month
        </p>
      </div>
      <div className="mb-4">
        <label
          htmlFor="card-element"
          className="block text-sm font-medium text-gray-700"
        >
          Credit or debit card
        </label>
        <CardElement
          id="card-element"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-md text-base uppercase py-2 font-bold mt-4"
      >
        Subscribe
      </button>
    </form>
  );
};

export default CheckoutForm;
