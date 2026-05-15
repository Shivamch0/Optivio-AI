import Button from "../common/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <h1 className="text-2xl font-bold">RankPilot AI</h1>

          <div className="hidden md:flex gap-6">
            {["Features", "Solutions", "Pricing", "Docs"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-600 hover:text-purple-700 transition"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button className="text-gray-700 hover:text-purple-700">
            Log In
          </button>

          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
