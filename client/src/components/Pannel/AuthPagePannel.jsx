function AuthPagePannel() {
  const metrics = [
    ["94", "SEO score"],
    ["18k", "Keywords"],
    ["42%", "ROI lift"],
  ];

  return (
    <aside className="hidden min-h-[720px] flex-col justify-between bg-[#121826] p-8 text-white lg:flex">
      <div>
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6d5dfc] text-sm">
              O
            </span>
            Optivio AI
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/70">
            SEO OS
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b1120] p-3 shadow-2xl shadow-black/25">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
            alt="Analytics dashboard preview"
            className="h-[340px] w-full rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-8 grid grid-cols-3 gap-3">
          {metrics.map(([value, label]) => (
            <div
              key={label}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
            >
              <p className="text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-white/55">{label}</p>
            </div>
          ))}
        </div>

        <h1 className="max-w-xl text-4xl font-bold leading-tight">
          Master the Search Landscape.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-white/68">
          Turn audits, keyword movement, and AI recommendations into one focused
          command center for search growth.
        </p>
      </div>
    </aside>
  );
}

export default AuthPagePannel;
