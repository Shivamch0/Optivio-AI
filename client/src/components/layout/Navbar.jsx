import { Link } from "react-router-dom";

export default function Navbar() {
  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Analytics", href: "#analytics" },
    { label: "Customers", href: "#customers" },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#d9e0ea] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#101828] text-xs font-bold text-white">
              O
            </span>
            <span className="text-lg font-bold">Optivio AI</span>
          </Link>

          <div className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={`/${item.href}`}
                className="text-sm font-semibold text-[#667085] transition hover:text-[#175cd3]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-[#344054] hover:text-[#175cd3]"
          >
            Log In
          </Link>

          <Link
            to="/signup"
            className="h-9 rounded-lg bg-[#101828] px-4 text-sm font-bold text-white transition hover:bg-[#1d2939]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
