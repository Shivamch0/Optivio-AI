import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminOverview } from "../api/admin.api.js";

export default function Admin() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [message, setMessage] = useState("Loading admin overview...");

  useEffect(() => {
    Promise.resolve().then(async () => {
      try {
        const res = await getAdminOverview();
        setOverview(res.data);
        setMessage("");
      } catch (error) {
        setMessage(error?.response?.data?.message || "Admin access required.");
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#eef2f7] px-6 py-8 text-[#101828]">
      <main className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 rounded-lg border border-[#d0d5dd] bg-white px-4 py-2 text-sm font-bold text-[#344054]"
        >
          Back to dashboard
        </button>
        <section className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Admin overview</h1>
          {message && <p className="mt-4 text-sm font-semibold text-[#667085]">{message}</p>}
          {overview && (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {[
                  ["Users", overview.users],
                  ["Websites", overview.websites],
                  ["Reports", overview.reports],
                  ["Keywords", overview.keywords],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-[#e4e7ec] bg-[#f8fafc] p-4">
                    <p className="text-xs font-bold uppercase text-[#667085]">{label}</p>
                    <p className="mt-3 text-2xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                {overview.recentUsers.map((item) => (
                  <div key={item._id} className="rounded-lg border border-[#e4e7ec] p-4">
                    <p className="font-bold">{item.userName}</p>
                    <p className="text-sm text-[#667085]">{item.email} - {item.role}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
