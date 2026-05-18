import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { runSeoAudit } from "../api/website.api.js";
import { useWorkspaceData } from "../hooks/useWorkspaceData.js";
import AppLayout from "../layouts/AppLayout.jsx";
import {
  buildTrendData,
  buttonDark,
  formatDate,
  getErrorMessage,
  pageShell,
  panel,
  scoreTone,
} from "../utils/dashboard.js";

export default function Dashboard({ user }) {
  const workspace = useWorkspaceData();
  const {
    keywords,
    loadNotifications,
    message,
    notifications,
    reports,
    selectedWebsite,
    selectedWebsiteId,
    setMessage,
    setReports,
    setWebsites,
    websites,
  } = workspace;

  const latestReport = reports[0];
  const trendData = buildTrendData(reports);
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleAudit = async () => {
    if (!selectedWebsiteId) {
      setMessage("Add a website before running an audit.");
      return;
    }

    setMessage("Running audit. This can take a few seconds.");
    try {
      const res = await runSeoAudit(selectedWebsiteId);
      setWebsites((current) =>
        current.map((website) =>
          website._id === selectedWebsiteId ? res.data.website : website,
        ),
      );
      setReports((current) => [res.data.report, ...current]);
      setMessage("Audit completed successfully.");
      loadNotifications();
    } catch (error) {
      setMessage(getErrorMessage(error, "Audit failed. Please check the URL and try again."));
    }
  };

  const stats = [
    ["Websites", websites.length, "tracked properties"],
    ["Latest SEO", selectedWebsite?.seoScore || 0, "score"],
    ["Keywords", keywords.length, "tracked terms"],
    ["Unread", unreadCount, "notifications"],
  ];

  return (
    <AppLayout user={user}>
      <div className={pageShell}>
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-[#175cd3]">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">Command center</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
              Monitor top SEO health, recent audits, notifications, and performance trends.
            </p>
          </div>
          <button type="button" onClick={handleAudit} className={buttonDark}>
            Run latest audit
          </button>
        </section>

        {message && <div className="mt-4 rounded-lg border border-[#d9dde7] bg-white px-4 py-3 text-sm font-semibold text-[#344054]">{message}</div>}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, helper]) => (
            <div key={label} className={panel}>
              <p className="text-xs font-bold uppercase text-[#667085]">{label}</p>
              <p className="mt-3 text-3xl font-bold">{Number(value).toLocaleString()}</p>
              <p className="mt-1 text-sm text-[#667085]">{helper}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className={panel}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">SEO trend</h2>
              <span className="text-sm font-semibold text-[#667085]">{selectedWebsite?.domain || "No website selected"}</span>
            </div>
            <div className="mt-6 h-72">
              {trendData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid stroke="#e4e7ec" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="seo" stroke="#2563eb" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="speed" stroke="#059669" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="issues" stroke="#dc6803" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[#d0d5dd] text-sm text-[#667085]">
                  Run two audits to show trend charts.
                </div>
              )}
            </div>
          </div>

          <div className={panel}>
            <h2 className="text-lg font-bold">Latest audit</h2>
            {latestReport ? (
              <div className="mt-5 space-y-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${scoreTone(latestReport.seoScore)}`}>
                  {latestReport.seoScore}/100 SEO
                </span>
                <p className="text-sm font-semibold text-[#344054]">{latestReport.titleTag || "No title found"}</p>
                <div className="grid grid-cols-2 gap-3 text-sm text-[#667085]">
                  <span>Speed {latestReport.pageSpeedScore}</span>
                  <span>H1 {latestReport.h1TagsCount}</span>
                  <span>Alt {latestReport.imageAltCoverage}%</span>
                  <span>Issues {latestReport.technicalIssues?.length || 0}</span>
                </div>
              </div>
            ) : (
              <p className="mt-5 rounded-lg border border-dashed border-[#d0d5dd] p-5 text-sm text-[#667085]">No audit report yet.</p>
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className={panel}>
            <h2 className="text-lg font-bold">Recent notifications</h2>
            <div className="mt-4 space-y-3">
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification._id} className="rounded-lg border border-[#e4e7ec] p-4">
                  <p className="text-sm font-bold">{notification.title}</p>
                  <p className="mt-1 text-sm text-[#667085]">{notification.message}</p>
                </div>
              ))}
              {!notifications.length && <p className="text-sm text-[#667085]">No notifications yet.</p>}
            </div>
          </div>

          <div className={panel}>
            <h2 className="text-lg font-bold">Quick stats</h2>
            <div className="mt-4 space-y-3 text-sm text-[#667085]">
              <p>Selected website: <span className="font-semibold text-[#344054]">{selectedWebsite?.websiteName || "None"}</span></p>
              <p>Last analyzed: <span className="font-semibold text-[#344054]">{formatDate(selectedWebsite?.lastAnalyzed)}</span></p>
              <p>Open issues: <span className="font-semibold text-[#344054]">{selectedWebsite?.technicalIssues?.length || 0}</span></p>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
