import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const err = useRouteError();

  const status = err?.status;
  const message =
    err?.statusText ||
    err?.message ||
    "The page you requested could not be found.";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-xl w-full card bg-base-100 border shadow-sm">
        <div className="card-body">
          <h1 className="text-4xl font-black">
            {status ? `Error ${status}` : "Oops!"}
          </h1>
          <p className="mt-2 opacity-70">{message}</p>

          <div className="mt-6 flex gap-3">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            <Link to="/services" className="btn btn-outline">
              Services
            </Link>
          </div>

          {import.meta.env.DEV && err && (
            <details className="mt-6">
              <summary className="cursor-pointer opacity-70">
                Developer details
              </summary>
              <pre className="mt-3 p-3 rounded bg-base-200 overflow-auto text-xs">
                {JSON.stringify(err, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
