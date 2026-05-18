import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api.js";

const navItems = [
  ["/dashboard", "Dashboard", "D"],
  ["/websites", "Websites", "W"],
  ["/audits", "Audits", "A"],
  ["/keywords", "Keywords", "K"],
  ["/competitors", "Competitors", "C"],
  ["/ai-insights", "AI Insights", "AI"],
  ["/marketing-studio", "Marketing Studio", "MS"],
  ["/notifications", "Notifications", "N"],
  ["/settings", "Settings", "S"],
];

export default function AppLayout({ children, user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-dvh bg-[#eef2f7] text-[#101828] lg:grid lg:grid-cols-[244px_1fr]">
      <aside className="border-b border-[#d9e0ea] bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-14 items-center justify-between px-4 lg:h-auto lg:flex-col lg:items-stretch lg:gap-4 lg:py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#101828] text-sm font-bold text-white">
              O
            </span>
            <div>
              <p className="font-bold">Optivio AI</p>
              <p className="text-xs text-[#667085]">Search intelligence</p>
            </div>
          </div>

          <nav className="hidden gap-1 lg:flex lg:flex-col">
            {navItems.map(([to, label, icon]) => (
              <NavLink
                key={to}
                to={to}
              className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive
                      ? "bg-[#e9f1ff] text-[#175cd3]"
                      : "text-[#344054] hover:bg-[#f3f6fb]"
                  }`
                }
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[11px] font-bold text-[#475467] ring-1 ring-[#e4e7ec]">
                  {icon}
                </span>
                {label}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `mt-2 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive ? "bg-[#e9f1ff] text-[#175cd3]" : "text-[#344054] hover:bg-[#f3f6fb]"
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-t border-[#edf1f6] px-4 py-2 lg:hidden">
          {navItems.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `shrink-0 rounded-lg px-3 py-2 text-sm font-semibold ${
                  isActive ? "bg-[#101828] text-white" : "bg-[#f8fafc] text-[#344054]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-[#edf1f6] p-5 lg:block">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full rounded-lg border border-[#d0d5dd] px-3 py-2 text-left text-sm font-semibold text-[#344054]"
          >
            {user?.userName || "Profile"}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg bg-[#101828] px-3 py-2 text-sm font-bold text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <main>{children}</main>
    </div>
  );
}
