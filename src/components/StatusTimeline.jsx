export const STATUS_STEPS = [
  { key: "assigned", label: "Assigned" },
  { key: "planning", label: "Planning phase" },
  { key: "materials", label: "Material prepared" },
  { key: "ontheway", label: "On the way to venue" },
  { key: "setup", label: "Setup in progress" },
  { key: "complete", label: "Complete" },
];

export function getStepIndex(statusKey) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === statusKey);
  return idx < 0 ? 0 : idx;
}

export function StatusTimeline({ statusKey = "assigned" }) {
  const activeIndex = getStepIndex(statusKey);
  const progress = Math.round((activeIndex / (STATUS_STEPS.length - 1)) * 100);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="font-bold">Project status</div>
        <div className="text-sm opacity-70">{progress}%</div>
      </div>

      <progress
        className="progress progress-primary w-full mt-2"
        value={progress}
        max="100"
      />

      <ul className="steps steps-vertical lg:steps-horizontal w-full mt-4">
        {STATUS_STEPS.map((s, idx) => (
          <li
            key={s.key}
            className={`step ${idx <= activeIndex ? "step-primary" : ""}`}
          >
            <span className="text-xs lg:text-sm">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
