export default function SectionCard({
  title,
  right,
  children,
  className = "",
}) {
  return (
    <div className={`card bg-base-100 border ${className}`}>
      <div className="card-body">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold">{title}</h2>
          {right}
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
