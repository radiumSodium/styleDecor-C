export default function PaymentBadge({ status, transactionId }) {
  const paid = status === "paid";
  return (
    <span
      className={`badge ${paid ? "badge-success" : "badge-warning"} badge-sm`}
      title={transactionId ? `Txn: ${transactionId}` : ""}
    >
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
}
