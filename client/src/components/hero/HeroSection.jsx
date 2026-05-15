import SearchBar from "./SearchBar";
import DashboardPreview from "./DashboardPreview";

export default function HeroSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
          ✨ Next-Gen SEO Intelligence
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-8">
          AI-Powered SEO & Digital Marketing Analytics Platform
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
          RankPilot transforms complex data into actionable growth strategies.
          Dominate search results with real-time analytics and predictive AI
          insights.
        </p>

        <SearchBar />
      </div>

      <DashboardPreview />
    </section>
  );
}
