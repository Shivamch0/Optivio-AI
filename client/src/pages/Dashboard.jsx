import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../api/auth.api.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
        setStatus("authenticated");
      } catch {
        setStatus("unauthenticated");
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f9fb] text-[#191c1e]">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-12">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
              Optivio AI
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[#111827]">
              Dashboard
            </h1>
          </div>

          {status === "authenticated" && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
            >
              Logout
            </button>
          )}
        </header>

        <section className="mt-16 max-w-2xl">
          <p className="text-lg font-semibold text-[#111827]">
            {status === "loading"
              ? "Checking your session..."
              : `Welcome, ${user?.userName || "there"}.`}
          </p>
          <p className="mt-3 text-gray-600">
            You are signed in with {user?.email || "your account"}. Website
            management, SEO audits, and analytics will live here next.
          </p>
        </section>
      </main>
    </div>
  );
}
