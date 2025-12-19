import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useAuth from "../../auth/useAuth";

function formatMoneyBDT(n) {
  if (typeof n !== "number") return "—";
  return `৳${n.toLocaleString("en-BD")}`;
}

// Declare helper component OUTSIDE render
function Label({ children }) {
  return <div className="label px-0 py-0 pb-2">{children}</div>;
}

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  //  read draft from route state OR sessionStorage
  const draft = useMemo(() => {
    if (location.state?.serviceId) return location.state;

    const saved = sessionStorage.getItem("sd_booking_draft");
    if (!saved) return null;

    try {
      const parsed = JSON.parse(saved);
      return parsed?.serviceId ? parsed : null;
    } catch {
      return null;
    }
  }, [location.state]);

  const ok = useMemo(() => !!draft?.serviceId, [draft]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [venue, setVenue] = useState(
    draft?.type === "studio" ? "StyleDecor Studio" : ""
  );
  const [address, setAddress] = useState("");
  const [agree, setAgree] = useState(false);

  // Auto-fill name from logged-in user
  useEffect(() => {
    if (!customerName && (user?.name || user?.displayName)) {
      setCustomerName(user?.name || user?.displayName);
    }
  }, [user, customerName]);

  const canContinue = customerName && phone && venue && agree;

  if (!ok) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="alert alert-warning">
          Booking data missing. Please select a service again.
        </div>
        <div className="mt-6">
          <Link to="/services" className="btn btn-primary rounded-xl">
            Go to Services
          </Link>
        </div>
      </div>
    );
  }

  const handleProceedToPayment = () => {
    if (!canContinue) return;

    const nextDraft = {
      ...draft,
      customerName,
      phone,
      venue,
      address,
    };
    sessionStorage.setItem("sd_booking_draft", JSON.stringify(nextDraft));

    navigate("/payment", { state: nextDraft });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Confirm <span className="text-primary">Booking</span>
          </h1>
          <p className="mt-2 sm:mt-3 opacity-70 max-w-2xl leading-relaxed">
            Review details, add venue/contact info, then proceed to payment.
          </p>
        </div>

        <Link
          to="/services"
          className="btn btn-outline rounded-xl w-full sm:w-auto"
        >
          Back to Services
        </Link>
      </div>

      <div className="mt-8 sm:mt-10 grid lg:grid-cols-3 gap-6 items-start">
        {/* Summary */}
        <div className="lg:col-span-1 card bg-base-100 border">
          <div className="card-body p-6 sm:p-7">
            <h2 className="text-xl font-bold">Booking Summary</h2>

            <div className="mt-4 rounded-2xl overflow-hidden border bg-base-200">
              <img
                src={
                  draft.image ||
                  "https://images.unsplash.com/photo-1523438097201-512ae7d59cfc?auto=format&fit=crop&w=1200&q=60"
                }
                alt={draft.serviceTitle}
                className="h-40 w-full object-cover"
              />
            </div>

            <div className="mt-4">
              <div className="font-bold text-lg leading-snug">
                {draft.serviceTitle}
              </div>
              <div className="opacity-70 text-sm mt-1 capitalize">
                {draft.category} • {draft.type}
              </div>
              <div className="opacity-70 text-sm">
                {draft.date} • {draft.slot}
              </div>
            </div>

            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-base-200 border">
              <div className="flex items-center justify-between gap-3">
                <span className="opacity-70">Estimated total</span>
                <span className="text-xl font-black">
                  {formatMoneyBDT(draft.price)}
                </span>
              </div>
              <p className="text-xs opacity-60 mt-2 leading-relaxed">
                Final amount may change for custom add-ons (confirmed before
                completion).
              </p>
            </div>

            {draft.notes ? (
              <div className="mt-5 p-4 sm:p-5 rounded-2xl border">
                <div className="font-semibold">Notes</div>
                <p className="text-sm opacity-70 mt-1 leading-relaxed">
                  {draft.notes}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 card bg-base-100 border shadow-sm">
          <div className="card-body p-6 sm:p-7">
            <h2 className="text-2xl font-black">Your details</h2>
            <p className="mt-2 text-sm opacity-70 leading-relaxed">
              Provide contact and venue information. We’ll use this to confirm
              the booking.
            </p>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {/* Name */}
              <label className="form-control w-full">
                <Label>
                  <span className="label-text font-semibold">Name</span>
                </Label>
                <input
                  className="input input-bordered rounded-xl w-full"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </label>

              {/* Email (prefilled readonly) */}
              <label className="form-control w-full">
                <Label>
                  <span className="label-text font-semibold">Email</span>
                </Label>
                <input
                  className="input input-bordered rounded-xl w-full"
                  value={user?.email || ""}
                  readOnly
                />
              </label>

              {/* Phone */}
              <label className="form-control w-full md:col-span-2">
                <Label>
                  <span className="label-text font-semibold">Phone</span>
                </Label>
                <input
                  className="input input-bordered rounded-xl w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  required
                />
              </label>

              {/* Venue */}
              <label className="form-control w-full md:col-span-2">
                <Label>
                  <span className="label-text font-semibold">Venue</span>
                </Label>
                <input
                  className="input input-bordered rounded-xl w-full"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Venue name / location"
                  required
                />
              </label>

              {/* Address */}
              {draft.type !== "studio" && (
                <label className="form-control w-full md:col-span-2">
                  <Label>
                    <span className="label-text font-semibold">
                      Full Address
                    </span>
                  </Label>
                  <textarea
                    className="textarea textarea-bordered rounded-xl w-full"
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House, road, area, city + any parking/loading instruction"
                  />
                  <div className="mt-2 text-xs opacity-60 leading-relaxed">
                    Tip: include nearby landmark + floor/lift info if needed.
                  </div>
                </label>
              )}
            </div>

            <div className="mt-6 p-4 sm:p-5 rounded-2xl border bg-base-200">
              <label className="cursor-pointer flex items-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mt-1"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className="text-sm opacity-80 leading-relaxed">
                  I confirm the date & time. I understand onsite service needs
                  access & setup time.
                </span>
              </label>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to={`/services/${draft.serviceId}`}
                className="btn btn-outline rounded-xl w-full"
              >
                Edit Selection
              </Link>

              <button
                onClick={handleProceedToPayment}
                disabled={!canContinue}
                className="btn btn-primary rounded-xl w-full"
              >
                Proceed to Payment
              </button>
            </div>

            {!canContinue && (
              <p className="text-sm opacity-70 mt-3 leading-relaxed">
                Fill <b>name</b>, <b>phone</b>, <b>venue</b> and accept
                confirmation to continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
