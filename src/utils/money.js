export function formatMoneyBDT(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return `৳${num.toLocaleString("en-BD")}`;
}
