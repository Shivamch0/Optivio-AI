
import DashboardPreview from "./DashboardPreview";

export default function HeroSection() {
  return (
    <section className="mx-auto grid min-h-[calc(100dvh-56px)] max-w-7xl items-center gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-12">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-xs font-bold uppercase text-[#175cd3]">
          AI SEO workspace
        </div>

        <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#101828] lg:text-6xl">
          Audit, track, and improve SEO from one clean dashboard.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-[#667085] lg:text-lg">
          Optivio AI turns website audits, keywords, competitors, and recommendations into a focused SaaS workflow built for real SEO decisions.
        </p>


        <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
          {[
            ["Real audits", "HTML checks"],
            ["Keyword ideas", "Ranking signals"],
            ["Exports", "PDF, CSV, HTML"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[#dde3ee] bg-white p-3">
              <p className="text-xs font-bold uppercase text-[#667085]">{label}</p>
              <p className="mt-1 text-sm font-semibold text-[#344054]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <DashboardPreview />
    </section>
  );
}
