import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";

const STATUS_STEPS = [
  { key: "assigned", label: "Assigned" },
  { key: "planning", label: "Planning phase" },
  { key: "materials", label: "Material prepared" },
  { key: "ontheway", label: "On the way to venue" },
  { key: "setup", label: "Setup in progress" },
  { key: "complete", label: "Complete" },
];

function getStepIndex(statusKey) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === statusKey);
  return idx < 0 ? 0 : idx;
}

function formatMoneyBDT(n) {
  if (typeof n !== "number") return "—";
  return `৳${n.toLocaleString("en-BD")}`;
}

function StatusBadge({ statusKey }) {
  const map = {
    assigned: "badge-info",
    planning: "badge-warning",
    materials: "badge-accent",
    ontheway: "badge-secondary",
    setup: "badge-primary",
    complete: "badge-success",
  };
  return (
    <span className={`badge ${map[statusKey] || "badge-ghost"} badge-lg`}>
      {STATUS_STEPS.find((s) => s.key === statusKey)?.label || "Assigned"}
    </span>
  );
}

function StatusTimeline({ statusKey }) {
  const activeIndex = getStepIndex(statusKey);
  const progress = Math.round((activeIndex / (STATUS_STEPS.length - 1)) * 100);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <div className="font-bold">Project status</div>
        <div className="text-sm opacity-70">{progress}%</div>
      </div>

      <progress
        className="progress progress-primary w-full mt-2"
        value={progress}
        max="100"
      />

      {/* Stepper */}
      <ul className="steps steps-vertical lg:steps-horizontal w-full mt-4">
        {STATUS_STEPS.map((s, idx) => {
          const done = idx <= activeIndex;
          // DaisyUI: "step step-primary" will mark as done
          return (
            <li key={s.key} className={`step ${done ? "step-primary" : ""}`}>
              <span className="text-xs lg:text-sm">{s.label}</span>
            </li>
          );
        })}
      </ul>

      {/* Timeline list (more descriptive) */}
      <div className="mt-5 grid gap-3">
        {STATUS_STEPS.map((s, idx) => {
          const done = idx <= activeIndex;
          return (
            <div
              key={s.key}
              className={`flex items-start gap-3 p-3 rounded-2xl border bg-base-100 ${
                done ? "border-primary/40" : "opacity-70"
              }`}
            >
              <div
                className={`mt-1 h-3 w-3 rounded-full ${
                  done ? "bg-primary" : "bg-base-300"
                }`}
              />
              <div className="flex-1">
                <div className="font-semibold">{s.label}</div>
                <div className="text-sm opacity-70">
                  {done ? "Done / In progress" : "Pending"}
                </div>
              </div>
              <div className="text-xs opacity-60">{done ? "✓" : ""}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();

  // Demo bookings (later will come from API)
  const demoBookings = useMemo(
    () => [
      {
        _id: "bk1",
        serviceTitle: "Wedding Stage Premium",
        date: "2025-12-22",
        time: "5:00 PM",
        amount: 25000,
        venue: "Mirpur DOHS, Dhaka",
        status: "setup",
        type: "onsite",
      },
      {
        _id: "bk2",
        serviceTitle: "Home Birthday Decor",
        date: "2025-12-19",
        time: "7:30 PM",
        amount: 6000,
        venue: "Uttara Sector 10, Dhaka",
        status: "materials",
        type: "onsite",
      },
      {
        _id: "bk3",
        serviceTitle: "Studio Consultation",
        date: "2025-12-17",
        time: "2:00 PM",
        amount: 1500,
        venue: "StyleDecor Studio",
        status: "assigned",
        type: "studio",
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState(demoBookings[0]._id);
  const activeBooking =
    demoBookings.find((b) => b._id === activeId) || demoBookings[0];

  const activeIndex = getStepIndex(activeBooking.status);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Welcome,{" "}
            <span className="text-primary">{user?.name || "User"}</span>
          </h1>
          <p className="mt-2 opacity-70">
            Track your bookings, status updates, and upcoming
            schedules—everything in one place.
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/services" className="btn btn-primary rounded-full">
            Book New Service
          </Link>
          <Link to="/coverage" className="btn btn-outline rounded-full">
            Coverage Map
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary/20 to-base-100 border">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="text-sm opacity-70">Upcoming Bookings</div>
              <span className="badge badge-primary badge-outline">LIVE</span>
            </div>
            <div className="text-3xl font-black">{demoBookings.length}</div>
            <div className="text-sm opacity-70">Includes studio + onsite</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-secondary/20 to-base-100 border">
          <div className="card-body">
            <div className="text-sm opacity-70">Active Status</div>
            <div className="text-2xl font-black">
              {STATUS_STEPS[activeIndex].label}
            </div>
            <div className="text-sm opacity-70">
              Your current booking progress
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-accent/20 to-base-100 border">
          <div className="card-body">
            <div className="text-sm opacity-70">Next Schedule</div>
            <div className="text-xl font-black">
              {activeBooking.date} • {activeBooking.time}
            </div>
            <div className="text-sm opacity-70">{activeBooking.venue}</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-success/20 to-base-100 border">
          <div className="card-body">
            <div className="text-sm opacity-70">Total Paid (demo)</div>
            <div className="text-3xl font-black">
              {formatMoneyBDT(
                demoBookings.reduce((sum, b) => sum + b.amount, 0)
              )}
            </div>
            <div className="text-sm opacity-70">All bookings combined</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* Left: booking list */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 border">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Bookings</h2>
                <span className="badge badge-ghost">{demoBookings.length}</span>
              </div>

              <div className="mt-4 space-y-3">
                {demoBookings.map((b) => {
                  const isActive = b._id === activeId;
                  return (
                    <button
                      key={b._id}
                      onClick={() => setActiveId(b._id)}
                      className={`w-full text-left p-4 rounded-2xl border hover:shadow-sm transition ${
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-base-300 bg-base-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold leading-snug">
                            {b.serviceTitle}
                          </div>
                          <div className="text-sm opacity-70 mt-1">
                            {b.date} • {b.time}
                          </div>
                          <div className="text-sm opacity-70">
                            {b.type === "onsite"
                              ? "Onsite service"
                              : "Studio consultation"}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <StatusBadge statusKey={b.status} />
                          <div className="text-sm font-semibold">
                            {formatMoneyBDT(b.amount)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <Link
                  to="/services"
                  className="btn btn-outline w-full rounded-xl"
                >
                  Browse more packages
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-200 border mt-6">
            <div className="card-body">
              <h3 className="font-bold">Quick actions</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="btn btn-primary btn-sm rounded-xl">
                  Rebook
                </button>
                <button className="btn btn-secondary btn-sm rounded-xl">
                  Request Quote
                </button>
                <button className="btn btn-accent btn-sm rounded-xl">
                  Support
                </button>
                <button className="btn btn-outline btn-sm rounded-xl">
                  Download Invoice
                </button>
              </div>
              <p className="text-xs opacity-60 mt-3">
                (These buttons are UI now—later we’ll connect APIs.)
              </p>
            </div>
          </div>
        </div>

        {/* Right: details + timeline */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 border">
            <div className="card-body">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black">Booking Details</h2>
                  <p className="opacity-70 mt-1">
                    Track project delivery for your selected booking.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge statusKey={activeBooking.status} />
                  <button className="btn btn-outline btn-sm rounded-full">
                    Chat
                  </button>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border bg-base-100">
                  <div className="text-sm opacity-70">Service</div>
                  <div className="font-bold mt-1">
                    {activeBooking.serviceTitle}
                  </div>
                </div>
                <div className="p-4 rounded-2xl border bg-base-100">
                  <div className="text-sm opacity-70">Schedule</div>
                  <div className="font-bold mt-1">
                    {activeBooking.date} • {activeBooking.time}
                  </div>
                </div>
                <div className="p-4 rounded-2xl border bg-base-100">
                  <div className="text-sm opacity-70">Venue</div>
                  <div className="font-bold mt-1">{activeBooking.venue}</div>
                </div>
              </div>

              {/* Timeline */}
              <StatusTimeline statusKey={activeBooking.status} />

              {/* Helpful panel */}
              <div className="mt-7 grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border bg-base-200">
                  <div className="font-bold">What happens next?</div>
                  <p className="mt-2 opacity-80 text-sm">
                    We’ll notify you as your project moves through each phase.
                    If you need changes (color theme / setup time), message
                    support from the dashboard.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border bg-base-100">
                  <div className="font-bold">Tips for smooth setup</div>
                  <ul className="mt-2 text-sm opacity-80 list-disc pl-5 space-y-1">
                    <li>Confirm venue access time</li>
                    <li>Share reference photos (optional)</li>
                    <li>Keep a contact person available</li>
                    <li>Parking/loading info helps the team</li>
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-2 justify-end">
                <button className="btn btn-outline rounded-full">
                  Request Change
                </button>
                <button className="btn btn-primary rounded-full">
                  View Booking
                </button>
              </div>
            </div>
          </div>

          {/* Mini notification strip */}
          <div className="mt-6 alert alert-info">
            <span>
              ℹ️ Your project status updates will appear here. Next:{" "}
              <b>
                {
                  STATUS_STEPS[
                    Math.min(activeIndex + 1, STATUS_STEPS.length - 1)
                  ].label
                }
              </b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
