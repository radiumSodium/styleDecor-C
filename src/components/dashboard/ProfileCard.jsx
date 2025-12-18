import useAuth from "../../auth/useAuth";

export default function ProfileCard() {
  const { fbUser, user } = useAuth();

  return (
    <div className="card bg-base-100 border">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-14 rounded-2xl ring ring-primary/20 ring-offset-2 ring-offset-base-100">
              <img
                src={fbUser?.photoURL || "https://i.pravatar.cc/120"}
                alt="profile"
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-lg font-black truncate">
              {fbUser?.displayName || user?.name || "User"}
            </div>
            <div className="text-sm opacity-70 truncate">{fbUser?.email}</div>
            <div className="text-xs opacity-60 mt-1">
              Role:{" "}
              <span className="capitalize font-semibold">
                {user?.role || "user"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
