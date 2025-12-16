import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import { StatusTimeline } from "../../components/StatusTimeline";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const [decoratorId, setDecoratorId] = useState("");
  const [team, setTeam] = useState("");

  const load = async () => {
    const [bRes, dRes] = await Promise.all([
      axiosSecure.get("/api/bookings/all"),
      axiosSecure.get("/api/users?role=decorator"), // you must support this endpoint OR replace with your own
    ]);

    const bList = bRes.data?.data || [];
    setBookings(bList);
    setActiveId(bList?.[0]?._id || null);

    setDecorators(dRes.data?.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const active = bookings.find((b) => b._id === activeId);

  const assign = async () => {
    if (!active) return;
    await axiosSecure.patch(`/api/bookings/${active._id}/assign`, {
      decoratorId: decoratorId || null,
      team: team || "",
    });
    await load();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black">Admin Dashboard</h1>
          <p className="opacity-70 mt-2">
            Manage bookings, assign decorator/team.
          </p>
        </div>
        <button onClick={load} className="btn btn-outline rounded-full">
          Refresh
        </button>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 border lg:col-span-1">
          <div className="card-body">
            <h2 className="font-bold">All Bookings</h2>
            <div className="mt-3 space-y-3">
              {bookings.map((b) => (
                <button
                  key={b._id}
                  onClick={() => {
                    setActiveId(b._id);
                    setDecoratorId(b.assignedDecoratorId || "");
                    setTeam(b.assignedTeam || "");
                  }}
                  className={`w-full text-left p-4 rounded-2xl border ${
                    b._id === activeId
                      ? "border-primary bg-primary/5"
                      : "border-base-300"
                  }`}
                >
                  <div className="font-bold">{b.serviceTitle}</div>
                  <div className="text-sm opacity-70">
                    {b.date} • {b.slot}
                  </div>
                  <div className="text-sm opacity-70">{b.userEmail}</div>
                </button>
              ))}
              {bookings.length === 0 && (
                <div className="opacity-70">No bookings yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border lg:col-span-2">
          <div className="card-body">
            <h2 className="text-2xl font-black">Assignment & Status</h2>

            {!active ? (
              <div className="opacity-70 mt-3">Select a booking.</div>
            ) : (
              <>
                <div className="mt-4 grid md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl border">
                    <div className="text-sm opacity-70">Customer</div>
                    <div className="font-bold">{active.userEmail}</div>
                  </div>
                  <div className="p-4 rounded-2xl border">
                    <div className="text-sm opacity-70">Venue</div>
                    <div className="font-bold">{active.venue}</div>
                  </div>
                  <div className="p-4 rounded-2xl border">
                    <div className="text-sm opacity-70">Current</div>
                    <div className="font-bold">{active.status}</div>
                  </div>
                </div>

                <StatusTimeline statusKey={active.status} />

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text font-semibold">
                        Assign decorator
                      </span>
                    </div>
                    <select
                      className="select select-bordered"
                      value={decoratorId}
                      onChange={(e) => setDecoratorId(e.target.value)}
                    >
                      <option value="">(not assigned)</option>
                      {decorators.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name || d.email}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="form-control">
                    <div className="label">
                      <span className="label-text font-semibold">
                        Assign team (onsite)
                      </span>
                    </div>
                    <input
                      className="input input-bordered"
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      placeholder="Team A / 3 persons / van"
                    />
                  </label>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={assign}
                    className="btn btn-primary rounded-full"
                  >
                    Save Assignment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
