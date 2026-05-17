import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../api/auth.api.js";

const stats = [
  ["SEO Score", "84", "+12%"],
  ["Tracked Keywords", "1,248", "+86"],
  ["Open Issues", "17", "-9"],
  ["Organic Visits", "42.8k", "+18%"],
];

const priorities = [
  "Rewrite 8 missing meta descriptions",
  "Compress oversized product images",
  "Add internal links to ranking pages",
];

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
    <div className="min-h-screen bg-[#eef2f7] text-[#101828]">
      <header className="border-b border-[#dde3ee] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6d5dfc] text-sm font-bold text-white">
              O
            </span>
            <div>
              <p className="font-bold">Optivio AI</p>
              <p className="text-xs text-[#667085]">Search intelligence</p>
            </div>
          </div>

          {status === "authenticated" && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-[#d0d5dd] bg-white px-4 py-2 text-sm font-semibold text-[#344054] transition hover:bg-[#f8fafc]"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <section className="flex flex-col justify-between gap-6 rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#6d5dfc]">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {status === "loading"
                ? "Checking your session..."
                : `Welcome, ${user?.userName || "there"}.`}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">
              {user?.email
                ? `Signed in as ${user.email}.`
                : "Preparing your workspace."}{" "}
              Your audits, keyword movement, and AI recommendations will live
              here.
            </p>
          </div>

          <button
            type="button"
            className="h-11 rounded-lg bg-[#101828] px-5 text-sm font-bold text-white transition hover:bg-[#1d2939]"
          >
            New audit
          </button>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([label, value, trend]) => (
            <div
              key={label}
              className="rounded-xl border border-[#dde3ee] bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-[#667085]">{label}</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-3xl font-bold">{value}</p>
                <span className="rounded-full bg-[#ecfdf3] px-2.5 py-1 text-xs font-bold text-[#027a48]">
                  {trend}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Organic performance</h2>
                <p className="mt-1 text-sm text-[#667085]">
                  A compact view of your search momentum.
                </p>
              </div>
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-bold text-[#5a4ee8]">
                Last 30 days
              </span>
            </div>

            <div className="mt-8 flex h-64 items-end gap-3">
              {[44, 58, 52, 68, 74, 63, 82, 88, 76, 94, 89, 98].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex flex-1 items-end rounded-t-lg bg-[#eef2ff]"
                    style={{ height: `${height}%` }}
                  >
                    <div className="h-2/3 w-full rounded-t-lg bg-[#6d5dfc]" />
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">AI priorities</h2>
            <p className="mt-1 text-sm text-[#667085]">
              Highest-impact fixes to handle first.
            </p>

            <div className="mt-6 space-y-3">
              {priorities.map((priority, index) => (
                <div
                  key={priority}
                  className="flex gap-3 rounded-lg border border-[#e4e7ec] p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#101828] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium leading-6 text-[#344054]">
                    {priority}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
