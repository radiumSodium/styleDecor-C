import { Outlet, NavLink } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="sd-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-4">
          <label htmlFor="sd-drawer" className="btn btn-ghost lg:hidden">
            ☰
          </label>
          <Outlet />
        </div>
        <div className="drawer-side">
          <label htmlFor="sd-drawer" className="drawer-overlay"></label>
          <aside className="w-72 bg-base-100 p-4">
            <div className="text-xl font-black">StyleDecor</div>
            <div className="text-sm opacity-70 mb-4">Role: {user?.role}</div>

            <ul className="menu">
              {user?.role === "user" && (
                <li>
                  <NavLink to="/dashboard/user">User Dashboard</NavLink>
                </li>
              )}
              {user?.role === "admin" && (
                <li>
                  <NavLink to="/dashboard/admin">Admin Dashboard</NavLink>
                </li>
              )}
              {user?.role === "decorator" && (
                <li>
                  <NavLink to="/dashboard/decorator">
                    Decorator Dashboard
                  </NavLink>
                </li>
              )}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
