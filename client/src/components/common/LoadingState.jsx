function LoadingState({
  label = "Loading workspace",
  detail = "Preparing your SEO data...",
  compact = false,
}) {
  return (
    <div
      className={
        compact
          ? "rounded-lg border border-[#e4e7ec] bg-white p-5"
          : "flex min-h-screen items-center justify-center bg-[#eef2f7] px-5"
      }
    >
      <div className={compact ? "w-full" : "w-full max-w-md rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm"}>
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0">
            <div className="absolute inset-0 rounded-xl bg-[#175cd3]/10" />
            <div className="absolute inset-2 animate-spin rounded-full border-2 border-[#bfdbfe] border-t-[#175cd3]" />
            <div className="absolute inset-4.25 rounded-full bg-[#175cd3]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#101828]">{label}</p>
            <p className="mt-1 text-sm text-[#667085]">{detail}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-[#eef2f7]">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-[#175cd3]" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-2 rounded-full bg-[#eef2f7]" />
            <div className="h-2 rounded-full bg-[#eef2f7]" />
            <div className="h-2 rounded-full bg-[#eef2f7]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingPanel({ label = "Loading data", detail = "This should only take a moment." }) {
  return <LoadingState label={label} detail={detail} compact />;
}

export { LoadingPanel, LoadingState };
