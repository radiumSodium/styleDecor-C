export default function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* DaisyUI spinner */}
        <span className="loading loading-spinner loading-lg text-primary"></span>

        {/* Optional text */}
        <p className="text-sm opacity-70 tracking-wide">
          Loading, please wait…
        </p>
      </div>
    </div>
  );
}
