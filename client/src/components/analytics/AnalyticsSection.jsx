import Button from "../common/Button";

export default function AnalyticsSection() {
  return (
    <section className="bg-[#101828] py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 lg:grid-cols-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#93c5fd]">
            Built for demo-ready insights
          </span>

          <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-white lg:text-5xl">
            Move from raw audit data to decisions quickly.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#d0d5dd]">
            Optivio separates websites, reports, keywords, competitors, recommendations, and notifications into clear pages so the product feels scalable without becoming heavy.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              "Real audit checks for metadata, headings, images, and links",
              "Trend charts for SEO score, speed, and issue history",
              "Readable AI priorities tied to the latest audit",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-white">
                <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-7">
            <Button>Start Free Analysis</Button>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">AI optimization panel</h3>
            <span className="rounded-full bg-[#175cd3] px-3 py-1 text-xs font-bold text-white">
              LIVE
            </span>
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-[#d0d5dd]">Site health index</span>
              <span className="font-bold text-[#93c5fd]">88%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[88%] rounded-full bg-[#2563eb]" />
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-white p-4">
            <p className="text-xs font-bold uppercase text-[#667085]">Critical insight</p>
            <h4 className="mt-2 font-bold text-[#101828]">Image alt coverage is low</h4>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Add concise alt text to important landing page images to improve accessibility and image SEO.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
