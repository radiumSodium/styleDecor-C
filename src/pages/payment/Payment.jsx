import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

function formatMoneyBDT(n) {
  if (typeof n !== "number") return "—";
  return `৳${n.toLocaleString("en-BD")}`;
}

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [creating, setCreating] = useState(true);
  const [error, setError] = useState("");

  const stripePromise = useMemo(() => {
    const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    return loadStripe(pk);
  }, []);

  useEffect(() => {
    if (!state?.serviceId) {
      navigate("/services");
      return;
    }

    const createBooking = async () => {
      try {
        setCreating(true);
        setError("");

        const existingId = sessionStorage.getItem("sd_booking_id");
        if (existingId) {
          const res = await axiosSecure.get(`/api/bookings/${existingId}`);
          setBooking(res.data?.data);
          return;
        }

        const res = await axiosSecure.post("/api/bookings", state);
        const created = res.data?.data;

        setBooking(created);
        sessionStorage.setItem("sd_booking_id", created._id);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.message || "Booking create failed");
      } finally {
        setCreating(false);
      }
    };

    createBooking();
  }, [state, navigate]);

  const handlePaid = () => {
    // clear booking id so next booking can create new one
    sessionStorage.removeItem("sd_booking_id");
    navigate("/dashboard/user");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="card bg-base-100 border">
        <div className="card-body">
          <h1 className="text-3xl font-black">Payment</h1>
          <p className="opacity-70 mt-2">
            Pay securely using Stripe (test mode).
          </p>

          {creating && (
            <div className="mt-5 alert alert-info">
              Creating booking in database...
            </div>
          )}

          {error && <div className="mt-5 alert alert-error">{error}</div>}

          {booking && (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border bg-base-100">
                <div className="text-sm opacity-70">Service</div>
                <div className="font-bold text-lg">{booking.serviceTitle}</div>

                <div className="mt-3 text-sm opacity-70">Schedule</div>
                <div className="font-semibold">
                  {booking.date} • {booking.slot}
                </div>

                <div className="mt-3 text-sm opacity-70">Venue</div>
                <div className="font-semibold">{booking.venue}</div>

                <div className="mt-3 text-sm opacity-70">Amount</div>
                <div className="text-3xl font-black mt-1">
                  {formatMoneyBDT(booking.price)}
                </div>

                <div className="mt-2 text-sm opacity-70">
                  Payment status: <b>{booking.paymentStatus}</b>
                </div>
              </div>

              <div className="p-5 rounded-2xl border bg-base-200">
                <Elements stripe={stripePromise}>
                  <CheckoutForm booking={booking} onPaid={handlePaid} />
                </Elements>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-2">
            <Link to="/services" className="btn btn-outline">
              Back to Services
            </Link>
            <Link to="/" className="btn btn-ghost">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
