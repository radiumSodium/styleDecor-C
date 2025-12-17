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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="alert alert-error">{err || "Service not found"}</div>
        <div className="mt-6">
          <Link to="/services" className="btn btn-outline rounded-xl">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                {service.title}
              </h1>

              <p className="mt-3 opacity-80 max-w-2xl leading-relaxed">
                {service.description ||
                  "Premium decoration package for your event."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge badge-outline capitalize">
                  {service.category}
                </span>
                <span className="badge badge-outline capitalize">
                  {service.type}
                </span>
                {(service.tags || []).slice(0, 6).map((t) => (
                  <span key={t} className="badge badge-ghost">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* price box aligned nicely */}
            <div className="md:text-right">
              <div className="inline-block rounded-2xl border bg-base-100/60 backdrop-blur px-5 py-4">
                <div className="text-sm opacity-70">Starting from</div>
                <div className="text-3xl font-black leading-tight">
                  {formatMoneyBDT(service.price)}
                </div>
                <div className="text-sm opacity-70 mt-1">
                  Duration:{" "}
                  <span className="font-semibold">
                    {service.durationMins
                      ? `${service.durationMins} mins`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
            {/* end price box */}
          </div>
        </div>
      </section>

      {/* Details + Booking */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left */}
          <div className="card bg-base-100 border overflow-hidden">
            <figure className="h-72 sm:h-80 bg-base-200">
              <img
                className="h-full w-full object-cover"
                src={
                  service.image ||
                  "https://images.unsplash.com/photo-1523438097201-512ae7d59cfc?auto=format&fit=crop&w=1200&q=60"
                }
                alt={service.title}
              />
            </figure>

            <div className="card-body p-6 sm:p-7">
              <h2 className="text-xl font-bold">What’s included</h2>
              <ul className="mt-3 list-disc pl-5 opacity-80 space-y-1">
                <li>Theme planning & layout</li>
                <li>Props, setup and styling</li>
                <li>Lighting / floral (based on package)</li>
                <li>Team coordination (onsite)</li>
              </ul>

              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-base-200 border">
                <div className="font-semibold">Notes</div>
                <p className="opacity-80 text-sm mt-1 leading-relaxed">
                  Exact materials and setup depend on your venue and theme
                  preference. You can add custom notes while booking.
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="card bg-base-100 border shadow-sm">
            <div className="card-body p-6 sm:p-7">
              <h2 className="text-2xl font-black">Book this service</h2>
              <p className="opacity-70 mt-2 leading-relaxed">
                Select a date and time slot. We’ll confirm availability and
                proceed to payment.
              </p>

              {/* ✅ unified spacing block */}
              <div className="mt-6 grid gap-5">
                {/* Date */}
                <label className="form-control w-full">
                  <div className="label py-0 pb-2">
                    <span className="label-text font-semibold">
                      Select date
                    </span>
                  </div>
                  <input
                    type="date"
                    className="input input-bordered w-full rounded-xl"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>

                {/* Slot */}
                <div className="rounded-2xl border p-4 sm:p-5">
                  <div className="font-semibold">Select time slot</div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                  <div className="label py-0 pb-2">
                    <span className="label-text font-semibold">
                      Special notes (optional)
                    </span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full rounded-xl"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Venue details, theme color, reference link..."
                  />
                  <div className="mt-2 text-xs opacity-60 leading-relaxed">
                    Tip: mention your venue size, preferred colors, and any
                    reference photos/links.
                  </div>
                </label>

                {/* Total */}
                <div className="p-4 sm:p-5 rounded-2xl bg-base-200 border">
                  <div className="flex items-center justify-between gap-3">
                    <span className="opacity-70">Estimated total</span>
                    <span className="text-xl font-black">
                      {formatMoneyBDT(service.price)}
                    </span>
                  </div>
                  <p className="text-xs opacity-60 mt-2 leading-relaxed">
                    Final cost may vary for custom add-ons (we’ll confirm before
                    completion).
                  </p>
                </div>

                {/* Actions */}
                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="btn btn-primary w-full rounded-xl"
                >
                  Continue to Booking
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <Link to="/services" className="btn btn-outline rounded-xl">
                    Back
                  </Link>
                  <Link to="/coverage" className="btn btn-outline rounded-xl">
                    Coverage
                  </Link>
                </div>

                {!canContinue && (
                  <div className="text-sm opacity-70">
                    Please select <b>date</b> and <b>time slot</b> to continue.
                  </div>
                )}
              </div>
              {/* end unified spacing */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
