import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";
import { STATUS_STEPS, StatusTimeline } from "../../components/StatusTimeline";

function badgeClass(status) {
  switch (status) {
    case "assigned":
      return "badge-info";
    case "planning":
      return "badge-warning";
    case "materials":
      return "badge-warning";
    case "ontheway":
      return "badge-accent";
    case "setup":
      return "badge-primary";
    case "complete":
      return "badge-success";
    default:
      return "badge-ghost";
  }
}

export default function DecoratorDashboard() {
  const [list, setList] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await axiosSecure.get("/api/bookings/assigned");
      const data = res.data?.data || [];
      setList(data);
      setActiveId((prev) => prev || data?.[0]?._id || null);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load assigned work");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const active = useMemo(
    () => list.find((b) => b._id === activeId),
    [list, activeId]
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return list.filter((b) => {
      const matchQ =
        !query ||
        String(b.serviceTitle || "")
          .toLowerCase()
          .includes(query) ||
        String(b.venue || "")
          .toLowerCase()
          .includes(query) ||
        String(b.date || "")
          .toLowerCase()
          .includes(query);

      const matchStatus =
        statusFilter === "all" ? true : b.status === statusFilter;

      return matchQ && matchStatus;
    });
  }, [list, q, statusFilter]);

  const updateStatus = async (status) => {
    if (!active) return;
    setSaving(true);
    setErr("");
    try {
      await axiosSecure.patch(`/api/bookings/${active._id}/status`, { status });
      await load(); // refresh to reflect everywhere
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const callHref = active?.phone ? `tel:${active.phone}` : null;
  const mapHref = active?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        active.address
      )}`
    : active?.venue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        active.venue
      )}`
    : null;

  return (
    <div className="min-h-screen bg-base-200">
      {/* top bar */}
      {/* <div className="navbar bg-base-100 border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full px-4 flex justify-between">
          <div>
            <div className="text-xl font-black">
              Style<span className="text-primary">Decor</span> Decorator
            </div>
            <div className="text-xs opacity-60">Assigned Work & Updates</div>
          </div>

          <div className="flex gap-2">
            <Link to="/" className="btn btn-ghost btn-sm">
              Home
            </Link>
            <button onClick={load} className="btn btn-outline btn-sm">
              Refresh
            </button>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-black">
              Decorator Dashboard
            </h1>
            <p className="opacity-70 mt-2">
              View assigned jobs, requirements, and update progress.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="input input-bordered"
              placeholder="Search by service/venue/date..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="assigned">Assigned</option>
              <option value="planning">Planning</option>
              <option value="materials">Materials</option>
              <option value="ontheway">On the way</option>
              <option value="setup">Setup</option>
              <option value="complete">Completed</option>
            </select>
          </div>
        </div>

        {err && <div className="alert alert-error mt-4">{err}</div>}
        {loading && (
          <div className="alert alert-info mt-4">Loading assigned work...</div>
        )}

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* left list */}
          <div className="card bg-base-100 border lg:col-span-1">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">Assigned Jobs</h2>
                <span className="badge badge-outline">{filtered.length}</span>
              </div>

              <div className="mt-3 space-y-2 max-h-[560px] overflow-y-auto">
                {filtered.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => setActiveId(b._id)}
                    className={`w-full text-left p-4 rounded-2xl border transition ${
                      b._id === activeId
                        ? "border-primary bg-primary/5"
                        : "border-base-300 hover:border-base-400"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold">{b.serviceTitle}</div>
                      <span
                        className={`badge ${badgeClass(
                          b.status
                        )} badge-sm capitalize`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="text-sm opacity-70 mt-1">
                      {b.date} • {b.slot}
                    </div>
                    <div className="text-sm opacity-70">{b.venue}</div>
                    {b.assignedTeam && (
                      <div className="text-xs opacity-60 mt-1">
                        Team: {b.assignedTeam}
                      </div>
                    )}
                  </button>
                ))}

                {!loading && filtered.length === 0 && (
                  <div className="opacity-70">No assigned jobs found.</div>
                )}
              </div>
            </div>
          </div>

          {/* right details */}
          <div className="card bg-base-100 border lg:col-span-2">
            <div className="card-body">
              <h2 className="text-2xl font-black">Job Details & Progress</h2>

              {!active ? (
                <div className="opacity-70 mt-3">
                  Select a job from the left.
                </div>
              ) : (
                <>
                  {/* quick info */}
                  <div className="mt-4 grid md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl border">
                      <div className="text-sm opacity-70">Service</div>
                      <div className="font-bold">{active.serviceTitle}</div>
                    </div>

                    <div className="p-4 rounded-2xl border">
                      <div className="text-sm opacity-70">Schedule</div>
                      <div className="font-bold">
                        {active.date} • {active.slot}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border">
                      <div className="text-sm opacity-70">Status</div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold capitalize">
                          {active.status}
                        </div>
                        <span
                          className={`badge ${badgeClass(
                            active.status
                          )} capitalize`}
                        >
                          {active.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* requirements */}
                  <div className="mt-4 grid md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl border bg-base-200">
                      <div className="text-sm opacity-70">Customer</div>
                      <div className="font-bold">
                        {active.customerName || "—"}
                      </div>
                      <div className="text-sm opacity-70 mt-1">
                        Email: {active.userEmail}
                      </div>
                      <div className="text-sm opacity-70">
                        Phone: {active.phone || "—"}
                      </div>

                      <div className="mt-3 flex gap-2 flex-wrap">
                        {callHref && (
                          <a className="btn btn-sm btn-outline" href={callHref}>
                            Call
                          </a>
                        )}
                        {mapHref && (
                          <a
                            className="btn btn-sm btn-outline"
                            href={mapHref}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open Map
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border bg-base-200">
                      <div className="text-sm opacity-70">Venue</div>
                      <div className="font-bold">{active.venue}</div>
                      {active.address && (
                        <div className="text-sm opacity-70 mt-1">
                          Address: {active.address}
                        </div>
                      )}
                      {active.assignedTeam && (
                        <div className="text-sm opacity-70 mt-1">
                          Team:{" "}
                          <span className="font-semibold">
                            {active.assignedTeam}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {active.notes && (
                    <div className="mt-4 p-4 rounded-2xl border">
                      <div className="text-sm opacity-70">
                        Requirements / Notes
                      </div>
                      <div className="mt-1">{active.notes}</div>
                    </div>
                  )}

                  {/* timeline */}
                  <div className="mt-5">
                    <StatusTimeline statusKey={active.status} />
                  </div>

                  {/* status buttons */}
                  <div className="mt-6">
                    <div className="text-sm font-semibold mb-2">
                      Update Progress
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {STATUS_STEPS.map((s) => (
                        <button
                          key={s.key}
                          disabled={saving}
                          onClick={() => updateStatus(s.key)}
                          className={`btn rounded-xl ${
                            active.status === s.key
                              ? "btn-primary"
                              : "btn-outline"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {saving && (
                      <div className="mt-3 text-sm opacity-70">Saving...</div>
                    )}
                    <div className="text-xs opacity-60 mt-2">
                      Status updates are visible to users and admins
                      automatically.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* footer quick links */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Link to="/services" className="btn btn-outline btn-sm">
            View Services
          </Link>
          <Link to="/dashboard/decorator" className="btn btn-ghost btn-sm">
            Decorator Home
          </Link>
        </div>
      </div>
    </div>
  );
}
