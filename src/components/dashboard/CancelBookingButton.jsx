import { useState } from "react";
import axiosSecure from "../../api/axiosSecure";

export default function CancelBookingButton({ bookingId, disabled, onDone }) {
  const [loading, setLoading] = useState(false);

  const cancel = async () => {
    const ok = confirm("Cancel this booking?");
    if (!ok) return;

    setLoading(true);
    try {
      await axiosSecure.patch(`/api/bookings/${bookingId}/cancel`);
      onDone?.();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={cancel}
      disabled={disabled || loading}
      className="btn btn-outline btn-sm rounded-xl"
    >
      {loading ? "Cancelling..." : "Cancel Booking"}
    </button>
  );
}
