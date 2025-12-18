import { Link } from "react-router-dom";

export default function PayNowButton({ disabled, booking }) {
  // booking should include _id, price, serviceTitle etc.
  if (!booking?._id) return null;

  return (
    <Link
      to="/payment"
      state={{ bookingId: booking._id }}
      className={`btn btn-primary btn-sm rounded-xl ${
        disabled ? "btn-disabled" : ""
      }`}
    >
      Pay Now
    </Link>
  );
}
