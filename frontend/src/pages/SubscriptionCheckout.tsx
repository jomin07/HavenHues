import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";
import CheckoutForm from "../forms/Subscription/CheckoutForm";

const SubscriptionCheckout = () => {
  const { stripePromise } = useAppContext();
  const location = useLocation();
  const { plan, currentUser } = location.state;

  return (
    <Elements stripe={stripePromise}>
      <div className="flex flex-col items-center w-full mx-auto min-h-screen diagonal-background overflow-x-hidden">
        <div className="w-full mx-auto bg-white p-4 mt-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4">Subscription Checkout</h2>
          <CheckoutForm currentUser={currentUser} selectedPlan={plan} />
        </div>
      </div>
    </Elements>
  );
};

export default SubscriptionCheckout;
