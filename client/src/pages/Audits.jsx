import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getReportExportUrl, runSeoAudit } from "../api/website.api.js";
import { useWorkspaceData } from "../hooks/useWorkspaceData.js";
import AppLayout from "../layouts/AppLayout.jsx";
import {
  buildTrendData,
  buttonDark,
  buttonLight,
  formatDate,
  getErrorMessage,
  pageShell,
  panel,
  scoreTone,
} from "../utils/dashboard.js";

export default function Audits({ user }) {
  const {
    loadNotifications,
    reports,
    selectedWebsite,
    selectedWebsiteId,
    setMessage,
    message,
    setReports,
    setWebsites,
    websites,
  } = useWorkspaceData();
  const trendData = buildTrendData(reports);

  const handleAudit = async () => {
    if (!selectedWebsiteId) {
      setMessage("Select or add a website first.");
      return;
    }
    setMessage("Running audit.");
    try {
      const res = await runSeoAudit(selectedWebsiteId);
      setReports((current) => [res.data.report, ...current]);
      setWebsites(websites.map((website) => (website._id === selectedWebsiteId ? res.data.website : website)));
      setMessage("Audit completed.");
      loadNotifications();
    } catch (error) {
      setMessage(getErrorMessage(error, "Audit failed. Please check the URL."));
    }
  };

  return (
    <AppLayout user={user}>
      <div className={pageShell}>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold">Audit reports</h1>
            <p className="mt-2 text-sm text-[#667085]">Audit history, technical issues, export tools, and score trends.</p>
          </div>
          <button type="button" onClick={handleAudit} className={buttonDark}>Run audit</button>
        </div>
        {message && <div className="mt-4 rounded-lg border border-[#d9dde7] bg-white px-4 py-3 text-sm font-semibold text-[#344054]">{message}</div>}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className={panel}>
            <h2 className="text-lg font-bold">SEO score trend</h2>
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
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[#d0d5dd] text-sm text-[#667085]">Run two audits to show trends.</div>
              )}
            </div>
          </div>

          <div className={panel}>
            <h2 className="text-lg font-bold">Exports</h2>
            <p className="mt-2 text-sm text-[#667085]">{selectedWebsite?.domain || "Select a website"} report files</p>
            <div className="mt-5 grid gap-3">
              {["pdf", "csv", "json", "html"].map((format) => (
                <a key={format} href={selectedWebsiteId ? getReportExportUrl(selectedWebsiteId, format) : "#"} target={format === "json" || format === "html" ? "_blank" : undefined} rel="noreferrer" className={`${buttonLight} flex items-center justify-center uppercase ${!selectedWebsiteId ? "pointer-events-none opacity-50" : ""}`}>{format}</a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4">
          {reports.map((report) => (
            <article key={report._id} className={panel}>
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <p className="font-bold">{formatDate(report.analyzedAt)}</p>
                  <p className="mt-1 text-sm text-[#667085]">{report.titleTag || "No title tag detected"}</p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${scoreTone(report.seoScore)}`}>{report.seoScore}/100</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-[#667085] sm:grid-cols-5">
                <span>Speed {report.pageSpeedScore}</span>
                <span>H1 {report.h1TagsCount}</span>
                <span>Alt {report.imageAltCoverage}%</span>
                <span>Broken {report.brokenLinksCount}</span>
                <span>Issues {report.technicalIssues?.length || 0}</span>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {(report.technicalIssues || []).slice(0, 6).map((issue) => (
                  <div key={`${report._id}-${issue.issue}`} className="rounded-lg border border-[#e4e7ec] p-3">
                    <p className="text-xs font-bold uppercase text-[#667085]">{issue.severity}</p>
                    <p className="mt-1 text-sm font-semibold">{issue.issue}</p>
                    <p className="mt-1 text-xs text-[#667085]">{issue.solution}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
          {!reports.length && <div className={panel}><p className="text-sm text-[#667085]">No audit history yet.</p></div>}
        </section>
      </div>
    </AppLayout>
  );
}
