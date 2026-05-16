export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-[#f7f9fb] text-[#191c1e]">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Optivio AI
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[#111827]">
          Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          You are signed in. Website management, SEO audits, and analytics will
          live here next.
        </p>
      </main>
    </div>
  );
}
