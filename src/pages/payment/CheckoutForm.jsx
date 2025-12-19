import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axiosSecure from "../../api/axiosSecure";

export default function CheckoutForm({ booking, onPaid }) {
  const stripe = useStripe();
  const elements = useElements();

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!stripe || !elements) return;

    try {
      setPaying(true);

      const { data } = await axiosSecure.post(
        "/api/payments/create-payment-intent",
        {
          bookingId: booking._id,
        }
      );

      if (data?.alreadyPaid) {
        setSuccessMsg("Already paid ✅");
        onPaid?.(booking);
        return;
      }

      const clientSecret = data?.clientSecret;
      if (!clientSecret) throw new Error("No client secret received");

      const card = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      if (result.paymentIntent?.status === "succeeded") {
        await axiosSecure.patch(`/api/bookings/${booking._id}/pay`, {
          transactionId: result.paymentIntent.id,
        });

        setSuccessMsg("Payment successful ✅");
        onPaid?.({
          ...booking,
          paymentStatus: "paid",
          transactionId: result.paymentIntent.id,
        });
      } else {
        throw new Error("Payment not completed");
      }
    } catch (e2) {
      console.error(e2);
      setError(e2.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="p-4 rounded-2xl border bg-base-100">
        <label className="text-sm font-semibold">Card Details</label>
        <div className="mt-2 p-3 rounded-xl border bg-white">
          <CardElement
            options={{
              style: {
                base: { fontSize: "16px" },
              },
            }}
          />
        </div>

        {error && <div className="mt-3 alert alert-error">{error}</div>}
        {successMsg && (
          <div className="mt-3 alert alert-success">{successMsg}</div>
        )}

        <button
          className="btn btn-primary rounded-full w-full mt-4"
          disabled={!stripe || paying}
          type="submit"
        >
          {paying ? "Processing..." : "Pay by Card"}
        </button>

        <p className="text-xs opacity-60 mt-3">
          Test card: <b>4242 4242 4242 4242</b> • Any future date • Any CVC
        </p>
      </div>
    </form>
  );
}
