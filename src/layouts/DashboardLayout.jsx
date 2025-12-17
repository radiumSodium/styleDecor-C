import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function DashboardLayout() {
  const { fbUser, user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? "rounded-xl bg-primary/10 text-primary font-semibold"
      : "rounded-xl";

  const role = user?.role || "user";

  const dashPath =
    role === "admin"
      ? "/dashboard/admin"
      : role === "decorator"
      ? "/dashboard/decorator"
      : "/dashboard/user";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="sd-drawer" type="checkbox" className="drawer-toggle" />

        {/* MAIN CONTENT */}
        <div className="drawer-content flex flex-col">
          {/* Top bar */}
          <div className="sticky top-0 z-40 bg-base-100/90 backdrop-blur border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sd-drawer"
                  className="btn btn-ghost btn-sm lg:hidden"
                >
                  ☰
                </label>

                <div className="font-black text-lg">
                  Dashboard{" "}
                  <span className="text-primary capitalize">({role})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/" className="btn btn-ghost btn-sm">
                  Home
                </Link>

                {/* Avatar dropdown (unified position like Navbar) */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-sm"
                  >
                    <div className="avatar">
                      <div className="w-9 rounded-full ring ring-primary/30 ring-offset-2 ring-offset-base-100">
                        <img
                          src={fbUser?.photoURL || "https://i.pravatar.cc/80"}
                          alt="profile"
                        />
                      </div>
                    </div>
                  </div>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 border rounded-box w-64 p-2 shadow"
                  >
                    <li className="px-3 py-2">
                      <div className="font-semibold">
                        {fbUser?.displayName || "Account"}
                      </div>
                      <div className="text-xs opacity-70">
                        {fbUser?.email || ""}
                      </div>
                      <div className="text-xs opacity-60 mt-1">
                        Role:{" "}
                        <span className="capitalize font-semibold">{role}</span>
                      </div>
                    </li>

                    <li>
                      <button onClick={() => navigate(dashPath)}>
                        Dashboard Home
                      </button>
                    </li>

                    <li>
                      <button onClick={handleLogout} className="text-error">
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Page area */}
          <div className="max-w-7xl mx-auto w-full p-4">
            <Outlet />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="drawer-side">
          <label htmlFor="sd-drawer" className="drawer-overlay"></label>

          <aside className="w-80 min-h-full bg-base-100 border-r">
            {/* Brand header */}
            <div className="p-5 border-b">
              <Link to="/" className="text-2xl font-black tracking-tight">
                style<span className="text-primary">decor</span>
              </Link>
              <div className="text-sm opacity-70 mt-1">
                Role: <span className="font-semibold capitalize">{role}</span>
              </div>
            </div>

            <ul className="menu gap-1">
              {role === "user" && (
                <li>
                  <NavLink className={linkClass} to="/dashboard/user">
                    User Dashboard
                  </NavLink>
                </li>
              )}

              {role === "admin" && (
                <>
                  <li>
                    <NavLink className={linkClass} to="/dashboard/admin">
                      Admin Dashboard
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      className={linkClass}
                      to="/dashboard/create-service"
                    >
                      Create Service
                    </NavLink>
                  </li>
                </>
              )}

              {role === "decorator" && (
                <>
                  <li>
                    <NavLink className={linkClass} to="/dashboard/decorator">
                      Decorator Dashboard
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      className={linkClass}
                      to="/dashboard/create-service"
                    >
                      Create Service
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* Bottom area */}
            <div className="mt-auto p-4 border-t">
              <Link to="/" className="btn btn-outline w-full">
                Back to Home
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
