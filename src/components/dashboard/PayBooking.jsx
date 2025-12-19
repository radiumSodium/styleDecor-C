import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axiosSecure from "../../api/axiosSecure";
import CheckoutForm from "../../components/payments/CheckoutForm";
import { formatMoneyBDT } from "../../utils/money";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PayBooking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const bRes = await axiosSecure.get(`/api/bookings/${bookingId}`);
        const b = bRes.data?.data;
        if (!b) throw new Error("Booking not found");
        if (mounted) setBooking(b);

        if (b.paymentStatus === "paid") {
          if (mounted) setClientSecret("");
          return;
        }

        const piRes = await axiosSecure.post(
          "/api/payments/create-payment-intent",
          {
            bookingId,
          }
        );

        const cs = piRes.data?.clientSecret;
        if (!cs) throw new Error("No clientSecret returned");
        if (mounted) setClientSecret(cs);
      } catch (e) {
        if (mounted)
          setErr(
            e?.response?.data?.message || e.message || "Failed to init payment"
          );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [bookingId]);

  if (loading)
    return <div className="max-w-3xl mx-auto p-4">Loading payment...</div>;
  if (err)
    return <div className="max-w-3xl mx-auto p-4 alert alert-error">{err}</div>;

  if (!booking) return null;

  if (booking.paymentStatus === "paid") {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="alert alert-success">Already paid ✅</div>
        <div className="mt-4">
          <Link className="btn btn-primary" to="/dashboard/user">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="card bg-base-100 border">
        <div className="card-body">
          <h1 className="text-2xl font-black">Pay for Booking</h1>

          <div className="mt-2 opacity-80">
            <div>
              <b>Service:</b> {booking.serviceTitle}
            </div>
            <div>
              <b>Schedule:</b> {booking.date} • {booking.slot}
            </div>
            <div>
              <b>Amount:</b> {formatMoneyBDT(Number(booking.price || 0))}
            </div>
          </div>

          <div className="mt-6">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  bookingId={bookingId}
                  onSuccess={() => navigate("/dashboard/user")}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
