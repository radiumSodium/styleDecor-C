import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../auth/useAuth";

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

  const { fbUser, authReady, loading } = useAuth();

  const [booking, setBooking] = useState(null);
  const [creating, setCreating] = useState(true);
  const [error, setError] = useState("");

  const didRunRef = useRef(false);

  const bookingKey = useMemo(() => {
    const uid = fbUser?.uid || "guest";
    return `sd_booking_id_${uid}`;
  }, [fbUser?.uid]);

  const stripePromise = useMemo(() => {
    const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!pk) return null; // avoid runtime crash
    return loadStripe(pk);
  }, []);

  useEffect(() => {
    if (!authReady || loading) return;

    // require login for payment
    if (!fbUser) {
      navigate("/login", {
        replace: true,
        state: { from: { pathname: "/payment" } },
      });
      return;
    }

    // require serviceId from route state
    if (!state?.serviceId) {
      navigate("/services", { replace: true });
      return;
    }

    //  prevent duplicate calls
    if (didRunRef.current) return;
    didRunRef.current = true;

    const run = async () => {
      try {
        setCreating(true);
        setError("");

        // Try to reuse existing booking ONLY for this user
        const existingId = sessionStorage.getItem(bookingKey);

        if (existingId) {
          try {
            const res = await axiosSecure.get(`/api/bookings/${existingId}`);
            const existing = res.data?.data;

            // If already paid, don't reuse it. Clear and create a new booking.
            if (existing?.paymentStatus === "paid") {
              sessionStorage.removeItem(bookingKey);
            } else {
              setBooking(existing);
              return;
            }
          } catch (e) {
            // stale id or belongs to someone else → clear it and continue
            const status = e?.response?.status;
            if (status === 401 || status === 403 || status === 404) {
              sessionStorage.removeItem(bookingKey);
            } else {
              throw e;
            }
          }
        }

        // Create new booking
        const res = await axiosSecure.post("/api/bookings", state);
        const created = res.data?.data;

        if (!created?._id) {
          throw new Error("Booking creation failed (missing _id)");
        }

        setBooking(created);
        sessionStorage.setItem(bookingKey, created._id);
      } catch (e) {
        console.error(e);
        setError(
          e?.response?.data?.message || e?.message || "Booking create failed"
        );
      } finally {
        setCreating(false);
      }
    };

    run();
  }, [authReady, loading, fbUser, state, navigate, bookingKey]);

  const handlePaid = () => {
    sessionStorage.removeItem(bookingKey);
    navigate("/dashboard/user", { replace: true });
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
                {!stripePromise ? (
                  <div className="alert alert-warning">
                    Stripe publishable key missing. Set
                    VITE_STRIPE_PUBLISHABLE_KEY.
                  </div>
                ) : (
                  <Elements stripe={stripePromise}>
                    <CheckoutForm booking={booking} onPaid={handlePaid} />
                  </Elements>
                )}
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
