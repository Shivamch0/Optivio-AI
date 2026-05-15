
import Button from "../common/Button";

export default function AnalyticsSection() {
  return (
    <section className="bg-[#111827] py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Content */}
        <div>
          <span className="uppercase tracking-[0.2em] text-purple-300 font-semibold text-sm">
            Engineered for Speed
          </span>

          <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight mt-6">
            Turn Data into Decisions with AI Recommendations
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed mt-8">
            Our platform doesn’t just show you numbers. It identifies the “Why”
            behind the “What,” offering specific steps to improve your site
            health and dominate search rankings.
          </p>

          <div className="space-y-5 mt-10">
            {[
              "Real-time health monitoring and alerts",
              "Automated backlink toxicity checks",
              "Predictive ranking fluctuations forecast",
            ].map((item) => (
              <div key={item} className="flex items-center gap-4 text-white">
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-sm">
                  ✓
                </div>

                <p className="text-lg">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button>Start Free Analysis</Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-700/20 blur-3xl rounded-full"></div>

          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-bold text-white">
                AI Optimization Panel
              </h3>

              <span className="bg-purple-600/30 text-purple-200 px-4 py-1 rounded-full text-xs font-bold animate-pulse">
                LIVE ANALYSIS
              </span>
            </div>

            {/* Progress */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-gray-300">Site Health Index</span>

                <span className="text-purple-300 font-bold">88%</span>
              </div>

              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[88%] bg-purple-500 rounded-full"></div>
              </div>
            </div>

            {/* Insight Card */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-2xl">
                ✨
              </div>

              <div>
                <h4 className="text-white font-semibold text-lg mb-2">
                  Critical Insight Found
                </h4>

                <p className="text-gray-300 leading-relaxed">
                  Images on your landing page lack alt-tags. Fixing this could
                  increase organic image search traffic by up to 22%.
                </p>

                <button className="mt-4 text-purple-300 hover:text-purple-200 font-semibold">
                  Apply Auto-Fix →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
