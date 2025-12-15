import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashPath =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "decorator"
      ? "/dashboard/decorator"
      : "/dashboard/user";

  return (
    <div className="sticky top-0 z-50 bg-base-100 border-b">
      <div className="navbar max-w-6xl mx-auto">
        <div className="navbar-start">
          <Link to="/" className="text-2xl font-black tracking-tight">
            style<span className="text-primary">decor</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-medium">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/services">Services</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-2">
          {user ? (
            <>
              <button
                className="btn btn-ghost"
                onClick={() => navigate(dashPath)}
              >
                Dashboard
              </button>

              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={user.photoURL || "https://i.pravatar.cc/80"}
                        alt="profile"
                      />
                    </div>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 border rounded-box w-52 p-2 shadow"
                >
                  <li>
                    <button onClick={() => navigate(dashPath)}>
                      Your account
                    </button>
                  </li>
                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
