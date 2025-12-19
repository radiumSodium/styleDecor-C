import { Link, useRouteError } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

export default function ErrorPage() {
  const err = useRouteError();

  const status = err?.status;
  const message =
    err?.statusText ||
    err?.message ||
    "The page you are looking for doesn’t exist or may have been moved.";

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 bg-base-200">
      <div className="max-w-lg w-full card bg-base-100 border shadow-sm">
        <div className="card-body p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <FiAlertCircle className="text-3xl text-primary" />
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight">
            {status ? `Error ${status}` : "Something went wrong"}
          </h1>

          <p className="mt-3 text-sm sm:text-base opacity-70 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn btn-primary rounded-full px-8">
              Back to Home
            </Link>

            <Link to="/services" className="btn btn-outline rounded-full px-8">
              Browse Services
            </Link>
          </div>

          <p className="mt-6 text-xs opacity-50">
            If the problem continues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
