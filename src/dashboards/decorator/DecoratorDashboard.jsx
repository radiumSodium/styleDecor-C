import useAuth from "../../auth/useAuth";

export default function DecoratorDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-black">Decorator Dashboard</h1>
      <p className="opacity-70 mt-2">Welcome, {user?.name}</p>
      <div className="mt-6 card bg-base-100 border">
        <div className="card-body">
          <p className="font-semibold">Your work area</p>
          <ul className="list-disc pl-5 opacity-80">
            <li>View assigned projects</li>
            <li>Update project status</li>
            <li>Manage availability (later)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
