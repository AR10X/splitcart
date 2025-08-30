import { useAuth } from "../auth/AuthContext";

export default function Profile(){
  const { user, logout } = useAuth();
  return (
    <div className="pb-16">
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-2">{user?.name || "Profile"}</h2>
        <div className="text-gray-600 mb-6">{user?.phone}</div>
        <button onClick={logout} className="w-full rounded bg-[var(--brand)] text-black py-2">
          Logout
        </button>
      </div>
    </div>
  );
}
