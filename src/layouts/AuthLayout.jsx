import { Outlet, NavLink } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-linear-to-b from-[#f6e6dc] to-base-200">
      <div className="max-w-6xl mx-auto px-6 py-10 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Left side */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="text-5xl font-black tracking-tight">
              style<span className="text-primary">decor</span>
            </div>

            <p className="mt-4 opacity-80 text-lg leading-relaxed max-w-md">
              Book studio consultations or onsite decoration services.
              Role-based dashboards for <b>User</b>, <b>Decorator</b>, and{" "}
              <b>Admin</b>.
            </p>

            <div className="mt-8 p-6 rounded-3xl bg-base-100/70 backdrop-blur border shadow-sm max-w-md">
              <p className="font-semibold">Quick links</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <NavLink className="btn btn-sm btn-outline rounded-full" to="/">
                  Home
                </NavLink>
                <NavLink
                  className="btn btn-sm btn-outline rounded-full"
                  to="/services"
                >
                  Services
                </NavLink>
                <NavLink
                  className="btn btn-sm btn-outline rounded-full"
                  to="/contact"
                >
                  Contact
                </NavLink>
              </div>

              <div className="mt-5 flex gap-2 flex-wrap">
                <span className="badge badge-outline">User</span>
                <span className="badge badge-outline">Decorator</span>
                <span className="badge badge-outline">Admin</span>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="card bg-base-100 border shadow-sm">
                <div className="card-body">
                  <Outlet />
                </div>
              </div>

              <p className="text-xs opacity-60 mt-4 text-center">
                By continuing, you agree to StyleDecor’s basic terms & policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
