import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import { STATUS_STEPS, StatusTimeline } from "../../components/StatusTimeline";

export default function DecoratorDashboard() {
  const [list, setList] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await axiosSecure.get("/api/bookings/assigned");
    const data = res.data?.data || [];
    setList(data);
    setActiveId(data?.[0]?._id || null);
  };

  useEffect(() => {
    load();
  }, []);

  const active = list.find((b) => b._id === activeId);

  const updateStatus = async (status) => {
    if (!active) return;
    setSaving(true);
    try {
      await axiosSecure.patch(`/api/bookings/${active._id}/status`, { status });
      await load(); // ✅ reflects everywhere after refetch
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black">
            Decorator Dashboard
          </h1>
          <p className="opacity-70 mt-2">
            Your assigned projects + status updates.
          </p>
        </div>
        <button onClick={load} className="btn btn-outline rounded-full">
          Refresh
        </button>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 border lg:col-span-1">
          <div className="card-body">
            <h2 className="font-bold">Assigned Projects</h2>
            <div className="mt-3 space-y-3">
              {list.map((b) => (
                <button
                  key={b._id}
                  onClick={() => setActiveId(b._id)}
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
                  <div className="text-sm opacity-70">{b.venue}</div>
                </button>
              ))}
              {list.length === 0 && (
                <div className="opacity-70">No assigned projects.</div>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border lg:col-span-2">
          <div className="card-body">
            <h2 className="text-2xl font-black">Update Status</h2>

            {!active ? (
              <div className="opacity-70 mt-3">
                Select a project to update status.
              </div>
            ) : (
              <>
                <div className="mt-4 grid md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl border">
                    <div className="text-sm opacity-70">Booking</div>
                    <div className="font-bold">{active.serviceTitle}</div>
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

                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {STATUS_STEPS.map((s) => (
                    <button
                      key={s.key}
                      disabled={saving}
                      onClick={() => updateStatus(s.key)}
                      className={`btn rounded-xl ${
                        active.status === s.key ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {saving && <div className="mt-3 opacity-70">Saving...</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
