import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";
import { StatusTimeline } from "../../components/StatusTimeline";

function formatMoneyBDT(n) {
  if (typeof n !== "number") return "—";
  return `৳${n.toLocaleString("en-BD")}`;
}

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/bookings/my");
      const list = res.data?.data || [];
      setBookings(list);
      setActiveId(list?.[0]?._id || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const active = bookings.find((b) => b._id === activeId);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black">User Dashboard</h1>
          <p className="opacity-70 mt-2">Your bookings & status updates.</p>
        </div>
        <Link to="/services" className="btn btn-primary rounded-full">
          Book New
        </Link>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 border lg:col-span-1">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">My Bookings</h2>
              <button onClick={load} className="btn btn-ghost btn-sm">
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="opacity-70">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="opacity-70">
                No bookings yet.{" "}
                <Link className="link link-primary" to="/services">
                  Book now
                </Link>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {bookings.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => setActiveId(b._id)}
                    className={`w-full text-left p-4 rounded-2xl border hover:shadow-sm transition ${
                      b._id === activeId
                        ? "border-primary bg-primary/5"
                        : "border-base-300"
                    }`}
                  >
                    <div className="font-bold">{b.serviceTitle}</div>
                    <div className="text-sm opacity-70">
                      {b.date} • {b.slot}
                    </div>
                    <div className="text-sm opacity-70">
                      {formatMoneyBDT(b.price)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 border lg:col-span-2">
          <div className="card-body">
            <h2 className="text-2xl font-black">Status Tracker</h2>
            {!active ? (
              <div className="opacity-70 mt-3">
                Select a booking to view status.
              </div>
            ) : (
              <>
                <div className="mt-4 grid md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl border">
                    <div className="text-sm opacity-70">Schedule</div>
                    <div className="font-bold">
                      {active.date} • {active.slot}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border">
                    <div className="text-sm opacity-70">Venue</div>
                    <div className="font-bold">{active.venue}</div>
                  </div>
                  <div className="p-4 rounded-2xl border">
                    <div className="text-sm opacity-70">Type</div>
                    <div className="font-bold">{active.type}</div>
                  </div>
                </div>

                <StatusTimeline statusKey={active.status} />

                <div className="mt-6 flex justify-end gap-2">
                  <Link to="/contact" className="btn btn-outline rounded-full">
                    Support
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
