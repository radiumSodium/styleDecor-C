import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

function formatMoneyBDT(n) {
  if (typeof n !== "number") return "—";
  return `৳${n.toLocaleString("en-BD")}`;
}

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  // From ServiceDetails navigate("/booking", { state: {...} })
  const draft = location.state;

  // If user refreshes, state is lost → send back to services
  const ok = useMemo(() => !!draft?.serviceId, [draft]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [venue, setVenue] = useState(
    draft?.type === "studio" ? "StyleDecor Studio" : ""
  );
  const [address, setAddress] = useState("");
  const [agree, setAgree] = useState(false);

  const canContinue = customerName && phone && venue && agree;

  if (!ok) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="alert alert-warning">
          Booking data missing (page refresh clears route state). Please select
          a service again.
        </div>
        <div className="mt-6">
          <Link to="/services" className="btn btn-primary">
            Go to Services
          </Link>
        </div>
      </div>
    );
  }

  const handleProceedToPayment = () => {
    if (!canContinue) return;

    // Later: POST booking to backend then navigate to payment with bookingId
    // For now: just move to /payment with state
    navigate("/payment", {
      state: {
        ...draft,
        customerName,
        phone,
        venue,
        address,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Confirm <span className="text-primary">Booking</span>
          </h1>
          <p className="mt-3 opacity-70">
            Review details, add venue/contact info, then proceed to payment.
          </p>
        </div>
        <Link to="/services" className="btn btn-outline">
          Back to Services
        </Link>
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        {/* Summary */}
        <div className="lg:col-span-1 card bg-base-100 border">
          <div className="card-body">
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
              <div className="font-bold">{draft.serviceTitle}</div>
              <div className="opacity-70 text-sm mt-1">
                {draft.category} • {draft.type}
              </div>
              <div className="opacity-70 text-sm">
                {draft.date} • {draft.slot}
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-base-200 border">
              <div className="flex items-center justify-between">
                <span className="opacity-70">Estimated total</span>
                <span className="text-xl font-black">
                  {formatMoneyBDT(draft.price)}
                </span>
              </div>
              <p className="text-xs opacity-60 mt-2">
                Final amount may change for custom add-ons (confirmed before
                completion).
              </p>
            </div>

            {draft.notes ? (
              <div className="mt-4 p-4 rounded-2xl border">
                <div className="font-semibold">Notes</div>
                <p className="text-sm opacity-70 mt-1">{draft.notes}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 card bg-base-100 border shadow-sm">
          <div className="card-body">
            <h2 className="text-2xl font-black">Your details</h2>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">Name</span>
                </div>
                <input
                  className="input input-bordered"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">Phone</span>
                </div>
                <input
                  className="input input-bordered"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  required
                />
              </label>

              <label className="form-control md:col-span-2">
                <div className="label">
                  <span className="label-text font-semibold">Venue</span>
                </div>
                <input
                  className="input input-bordered"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Venue name / location"
                  required
                />
              </label>

              {draft.type !== "studio" && (
                <label className="form-control md:col-span-2">
                  <div className="label">
                    <span className="label-text font-semibold">
                      Full Address
                    </span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered"
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House, road, area, city + any parking/loading instruction"
                  />
                </label>
              )}
            </div>

            <div className="mt-6 p-4 rounded-2xl border bg-base-200">
              <label className="cursor-pointer flex items-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mt-1"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className="text-sm opacity-80">
                  I confirm the date & time. I understand onsite service needs
                  access & setup time.
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <Link
                to={`/services/${draft.serviceId}`}
                className="btn btn-outline rounded-full"
              >
                Edit Selection
              </Link>
              <button
                onClick={handleProceedToPayment}
                disabled={!canContinue}
                className="btn btn-primary rounded-full"
              >
                Proceed to Payment
              </button>
            </div>

            {!canContinue && (
              <p className="text-sm opacity-70 mt-3">
                Fill name, phone, venue and accept confirmation to continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
