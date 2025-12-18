import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";
import { StatusTimeline } from "../../components/StatusTimeline";
import SectionCard from "../../components/dashboard/SectionCard";
import PaymentBadge from "../../components/dashboard/PaymentBadge";
import CancelBookingButton from "../../components/dashboard/CancelBookingButton";
import PayNowButton from "../../components/dashboard/PayNowButton";
import ProfileCard from "../../components/dashboard/ProfileCard";
import PaymentHistoryTable from "../../components/dashboard/PaymentHistoryTable";
import { formatMoneyBDT } from "../../utils/money";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async (keepSelection = true) => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/bookings/my");
      const list = res.data?.data || [];
      setBookings(list);

      if (!keepSelection) {
        setActiveId(list?.[0]?._id || null);
      } else {
        setActiveId((prev) =>
          prev && list.some((b) => b._id === prev)
            ? prev
            : list?.[0]?._id || null
        );
      }
    } catch (e) {
      console.error(e);
      setBookings([]);
      setActiveId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(false);
  }, []);

  const active = useMemo(
    () => bookings.find((b) => b._id === activeId),
    [bookings, activeId]
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black">User Dashboard</h1>
          <p className="opacity-70 mt-2">
            Profile, bookings, cancellations & payments.
          </p>
        </div>
        <Link to="/services" className="btn btn-primary rounded-full">
          Book New
        </Link>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileCard />

          <SectionCard
            title="My Bookings"
            right={
              <button
                onClick={() => load(true)}
                className="btn btn-ghost btn-sm"
              >
                Refresh
              </button>
            }
          >
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
              <div className="space-y-3">
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
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold">{b.serviceTitle}</div>
                      <PaymentBadge
                        status={b.paymentStatus}
                        transactionId={b.transactionId}
                      />
                    </div>
                    <div className="text-sm opacity-70">
                      {b.date} • {b.slot}
                    </div>
                    <div className="text-sm opacity-70">
                      {formatMoneyBDT(b.price)}
                    </div>
                    {b.status === "cancelled" && (
                      <div className="text-xs mt-1 text-error">Cancelled</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Status Tracker">
            {!active ? (
              <div className="opacity-70">Select a booking to view status.</div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-3">
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
                    <div className="text-sm opacity-70">Payment</div>
                    <div className="font-bold flex items-center gap-2">
                      <PaymentBadge
                        status={active.paymentStatus}
                        transactionId={active.transactionId}
                      />
                      <span className="opacity-70 text-sm">
                        {formatMoneyBDT(active.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <StatusTimeline statusKey={active.status} />
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  {/* Pay button only if unpaid & not cancelled */}
                  {active.paymentStatus !== "paid" &&
                    active.status !== "cancelled" && (
                      <PayNowButton booking={active} />
                    )}

                  {/* Cancel only if not cancelled & not completed */}
                  <CancelBookingButton
                    bookingId={active._id}
                    disabled={
                      active.status === "cancelled" ||
                      active.status === "complete"
                    }
                    onDone={() => load(true)}
                  />

                  <Link
                    to="/contact"
                    className="btn btn-outline btn-sm rounded-xl"
                  >
                    Support
                  </Link>
                </div>
              </>
            )}
          </SectionCard>

          <SectionCard title="Payment History & Receipts">
            <PaymentHistoryTable />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
