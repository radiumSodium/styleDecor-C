import useAuth from "../../auth/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-black">Admin Dashboard</h1>
      <p className="opacity-70 mt-2">Logged in as {user?.email}</p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="card bg-base-100 border">
          <div className="card-body">Manage Services</div>
        </div>
        <div className="card bg-base-100 border">
          <div className="card-body">Manage Decorators</div>
        </div>
        <div className="card bg-base-100 border">
          <div className="card-body">Manage Appointments</div>
        </div>
      </div>
    </div>
  );
}
