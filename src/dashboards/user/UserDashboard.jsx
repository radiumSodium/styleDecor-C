import useAuth from "../../auth/useAuth";

export default function UserDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-black">User Dashboard</h1>
      <p className="opacity-70 mt-2">Welcome, {user?.name}</p>
      <div className="mt-6 card bg-base-100 border">
        <div className="card-body">
          <p className="font-semibold">Next steps:</p>
          <ul className="list-disc pl-5 opacity-80">
            <li>Browse services</li>
            <li>Book a slot</li>
            <li>Track booking status</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
