export default function DashboardPreview() {
  const rows = [
    ["example.com", "86", "3 issues", "Active"],
    ["launchpage.io", "74", "7 issues", "Audit due"],
    ["marketstack.dev", "91", "1 issue", "Healthy"],
  ];

  return (
    <div className="rounded-lg border border-[#cfd8e3] bg-white p-3 shadow-xl">
      <div className="rounded-md border border-[#e4e7ec] bg-[#f8fafc] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-[#667085]">Command center</p>
            <h2 className="mt-1 text-xl font-bold">SEO performance</h2>
          </div>
          <span className="rounded-full bg-[#dcfae6] px-3 py-1 text-xs font-bold text-[#067647]">
            Live
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            ["SEO", "86"],
            ["Keywords", "128"],
            ["Alerts", "5"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-white p-3 ring-1 ring-[#e4e7ec]">
              <p className="text-xs text-[#667085]">{label}</p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 h-40 rounded-lg bg-white p-4 ring-1 ring-[#e4e7ec]">
          <div className="flex h-full items-end gap-3">
            {[42, 58, 51, 72, 68, 84, 79, 91].map((height, index) => (
              <div key={height + index} className="flex flex-1 items-end">
                <span
                  className="w-full rounded-t bg-[#2563eb]"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-[#e4e7ec] bg-white">
          {rows.map(([domain, score, issues, status]) => (
            <div key={domain} className="grid grid-cols-[1.2fr_0.5fr_0.7fr_0.7fr] gap-3 border-b border-[#edf1f6] px-3 py-3 text-sm last:border-b-0">
              <span className="font-semibold">{domain}</span>
              <span>{score}/100</span>
              <span className="text-[#667085]">{issues}</span>
              <span className="text-[#175cd3]">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
