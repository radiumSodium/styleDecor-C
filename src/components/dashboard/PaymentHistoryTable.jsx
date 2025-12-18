import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import { formatMoneyBDT } from "../../utils/money";

export default function PaymentHistoryTable() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/payments/my");
      setList(res.data?.data || []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="opacity-70">Loading payments...</div>;
  if (!list.length) return <div className="opacity-70">No payments yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Transaction</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p._id}>
              <td className="text-sm opacity-70">
                {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
              </td>
              <td className="font-semibold">{p.serviceTitle || "—"}</td>
              <td>{formatMoneyBDT(p.amount)}</td>
              <td className="text-xs opacity-70">{p.transactionId || "—"}</td>
              <td>
                <span
                  className={`badge ${
                    p.status === "succeeded" ? "badge-success" : "badge-warning"
                  }`}
                >
                  {p.status || "unknown"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={load} className="btn btn-ghost btn-sm mt-2">
        Refresh
      </button>
    </div>
  );
}
