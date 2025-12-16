import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";

function formatMoneyBDT(n) {
  if (typeof n !== "number") return "—";
  return `৳${n.toLocaleString("en-BD")}`;
}

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // booking UI state (later will go to DB)
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await axiosSecure.get(`/api/services/${id}`);
        const data = res.data?.data || res.data;
        if (!ignore) setService(data);
      } catch (e) {
        if (!ignore)
          setErr(e?.response?.data?.message || "Failed to load service");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => (ignore = true);
  }, [id]);

  const canContinue = useMemo(() => !!date && !!slot, [date, slot]);

  const handleContinue = () => {
    if (!canContinue) return;

    // For now: pass booking draft via state (later create booking in DB)
    navigate("/booking", {
      state: {
        serviceId: service?._id,
        serviceTitle: service?.title,
        price: service?.price,
        date,
        slot,
        notes,
        type: service?.type,
        category: service?.category,
        image: service?.image,
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="h-10 w-1/2 bg-base-200 rounded animate-pulse" />
        <div className="mt-6 grid lg:grid-cols-2 gap-8">
          <div className="h-80 bg-base-200 rounded-2xl animate-pulse" />
          <div className="space-y-3">
            <div className="h-6 w-3/4 bg-base-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-base-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-base-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-base-200 rounded animate-pulse mt-5" />
          </div>
        </div>
      </div>
    );
  }

  if (err || !service) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="alert alert-error">{err || "Service not found"}</div>
        <div className="mt-6">
          <Link to="/services" className="btn btn-outline">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-[#f6e6dc]">
        <div className="max-w-6xl mx-auto px-6 py-10 lg:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                {service.title}
              </h1>
              <p className="mt-3 opacity-80 max-w-2xl">
                {service.description ||
                  "Premium decoration package for your event."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge badge-outline">{service.category}</span>
                <span className="badge badge-outline">{service.type}</span>
                {(service.tags || []).slice(0, 6).map((t) => (
                  <span key={t} className="badge badge-ghost">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm opacity-70">Starting from</div>
              <div className="text-3xl font-black">
                {formatMoneyBDT(service.price)}
              </div>
              <div className="text-sm opacity-70">
                Duration:{" "}
                {service.durationMins ? `${service.durationMins} mins` : "—"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details + Booking */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: image + details */}
          <div className="card bg-base-100 border overflow-hidden">
            <figure className="h-80 bg-base-200">
              <img
                className="h-full w-full object-cover"
                src={
                  service.image ||
                  "https://images.unsplash.com/photo-1523438097201-512ae7d59cfc?auto=format&fit=crop&w=1200&q=60"
                }
                alt={service.title}
              />
            </figure>
            <div className="card-body">
              <h2 className="text-xl font-bold">What’s included</h2>
              <ul className="mt-2 list-disc pl-5 opacity-80 space-y-1">
                <li>Theme planning & layout</li>
                <li>Props, setup and styling</li>
                <li>Lighting / floral (based on package)</li>
                <li>Team coordination (onsite)</li>
              </ul>

              <div className="mt-5 p-4 rounded-2xl bg-base-200 border">
                <div className="font-semibold">Notes</div>
                <p className="opacity-80 text-sm mt-1">
                  Exact materials and setup depend on your venue and theme
                  preference. You can add custom notes while booking.
                </p>
              </div>
            </div>
          </div>

          {/* Right: booking card */}
          <div className="card bg-base-100 border shadow-sm">
            <div className="card-body">
              <h2 className="text-2xl font-black">Book this service</h2>
              <p className="opacity-70 mt-1">
                Select a date and time slot. We’ll confirm availability and
                proceed to payment.
              </p>

              <div className="mt-6 space-y-4">
                {/* Date */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold">
                      Select date
                    </span>
                  </div>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>

                {/* Slot */}
                <div>
                  <div className="font-semibold">Select time slot</div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((t) => {
                      const active = slot === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSlot(t)}
                          className={`btn btn-sm rounded-xl ${
                            active ? "btn-primary" : "btn-outline"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold">
                      Special notes (optional)
                    </span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Venue details, theme color, reference link..."
                  />
                </label>

                <div className="p-4 rounded-2xl bg-base-200 border">
                  <div className="flex items-center justify-between">
                    <span className="opacity-70">Estimated total</span>
                    <span className="text-xl font-black">
                      {formatMoneyBDT(service.price)}
                    </span>
                  </div>
                  <p className="text-xs opacity-60 mt-1">
                    Final cost may vary for custom add-ons (we’ll confirm before
                    completion).
                  </p>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="btn btn-primary w-full rounded-xl"
                >
                  Continue to Booking
                </button>

                <div className="flex gap-2">
                  <Link
                    to="/services"
                    className="btn btn-outline w-1/2 rounded-xl"
                  >
                    Back
                  </Link>
                  <Link
                    to="/coverage"
                    className="btn btn-outline w-1/2 rounded-xl"
                  >
                    Coverage
                  </Link>
                </div>

                {!canContinue && (
                  <div className="text-sm opacity-70">
                    Please select <b>date</b> and <b>time slot</b> to continue.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
