import { useWorkspaceData } from "../hooks/useWorkspaceData.js";
import AppLayout from "../layouts/AppLayout.jsx";
import { pageShell, panel } from "../utils/dashboard.js";

export default function AIInsights({ user }) {
  const { reports, selectedWebsite } = useWorkspaceData();
  const latestReport = reports[0];
  const recommendations =
    latestReport?.aiRecommendations?.length
      ? latestReport.aiRecommendations
      : selectedWebsite?.aiRecommendations || [];
  const issues = latestReport?.technicalIssues || selectedWebsite?.technicalIssues || [];

  return (
    <AppLayout user={user}>
      <div className={pageShell}>
        <h1 className="text-3xl font-bold">AI insights</h1>
        <p className="mt-2 text-sm text-[#667085]">AI priorities, optimization suggestions, content improvements, and SEO recommendations.</p>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className={panel}>
            <h2 className="text-lg font-bold">Optimization priorities</h2>
            <div className="mt-5 space-y-3">
              {(recommendations.length ? recommendations : ["Run an audit to generate AI recommendations."]).map((item, index) => (
                <div key={`${item}-${index}`} className="flex gap-3 rounded-lg border border-[#e4e7ec] p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#101828] text-xs font-bold text-white">{index + 1}</span>
                  <p className="text-sm font-medium leading-6 text-[#344054]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={panel}>
            <h2 className="text-lg font-bold">Content improvements</h2>
            <div className="mt-5 space-y-4 text-sm text-[#667085]">
              <p>Title: <span className="font-semibold text-[#344054]">{latestReport?.titleTag || "No latest title found"}</span></p>
              <p>Meta description: <span className="font-semibold text-[#344054]">{latestReport?.metaDescription || "Missing or not analyzed"}</span></p>
              <p>Keyword density topics: <span className="font-semibold text-[#344054]">{latestReport?.keywordDensity?.map((item) => item.keyword).join(", ") || "Waiting for audit"}</span></p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          {issues.slice(0, 6).map((issue) => (
            <div key={issue.issue} className={panel}>
              <p className="text-xs font-bold uppercase text-[#667085]">{issue.severity}</p>
              <h2 className="mt-2 font-bold">{issue.issue}</h2>
              <p className="mt-2 text-sm leading-6 text-[#667085]">{issue.solution || "Review this issue in the audit report."}</p>
            </div>
          ))}
        </section>
      </div>
    </AppLayout>
  );
}
