import {useNavigate} from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate();

  const handleLoginNavigate = () => {
    navigate("/login")
  }

  const handleSignUpNavigate = () => {
    navigate("/signup")
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#d9e0ea] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#101828] text-xs font-bold text-white">
              O
            </span>
            <span className="text-lg font-bold">Optivio AI</span>
          </button>

          <div className="hidden gap-6 md:flex">
            {["Features", "Analytics", "Customers"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-semibold text-[#667085] transition hover:text-[#175cd3]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLoginNavigate}
            className="text-sm font-semibold text-[#344054] hover:text-[#175cd3]"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={handleSignUpNavigate}
            className="h-9 rounded-lg bg-[#101828] px-4 text-sm font-bold text-white transition hover:bg-[#1d2939]"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
