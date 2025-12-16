import { Link, useLocation } from "react-router-dom";

export default function Payment() {
  const { state } = useLocation();

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="card bg-base-100 border">
        <div className="card-body">
          <h1 className="text-3xl font-black">Payment</h1>
          <p className="opacity-70 mt-2">
            (UI only) Next we’ll integrate Stripe and create booking in DB.
          </p>

          <pre className="mt-6 p-4 rounded bg-base-200 overflow-auto text-xs">
            {JSON.stringify(state, null, 2)}
          </pre>

          <div className="mt-6 flex gap-2">
            <Link to="/services" className="btn btn-outline">
              Back to Services
            </Link>
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
