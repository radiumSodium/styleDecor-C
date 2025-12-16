import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";

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

  // If refresh happens, state may be null
  useEffect(() => {
    if (!state?.serviceId) {
      navigate("/services");
      return;
    }

    const createBooking = async () => {
      try {
        setCreating(true);
        setError("");

        // Prevent duplicate booking if user comes back to this page
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

  const handlePayNowUI = () => {
    // UI only — later call Stripe Checkout
    alert("Payment UI only ✅ Next: Stripe integration.");
    navigate("/dashboard/user"); // or navigate to success page
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="card bg-base-100 border">
        <div className="card-body">
          <h1 className="text-3xl font-black">Payment</h1>
          <p className="opacity-70 mt-2">
            Booking is created in DB. Next step: Stripe payment.
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
              </div>

              <div className="p-5 rounded-2xl border bg-base-200">
                <div className="text-sm opacity-70">Total Amount</div>
                <div className="text-4xl font-black mt-2">
                  {formatMoneyBDT(booking.price)}
                </div>
                <div className="mt-2 text-sm opacity-70">
                  Payment status: <b>{booking.paymentStatus}</b>
                </div>

                <button
                  onClick={handlePayNowUI}
                  className="btn btn-primary rounded-full w-full mt-5"
                  disabled={creating}
                >
                  Pay Now (UI)
                </button>

                <p className="text-xs opacity-60 mt-3">
                  Stripe checkout will be integrated here.
                </p>
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
