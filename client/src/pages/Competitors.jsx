import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCompetitorAnalysis } from "../api/website.api.js";
import { useWorkspaceData } from "../hooks/useWorkspaceData.js";
import AppLayout from "../layouts/AppLayout.jsx";
import { buttonDark, getErrorMessage, pageShell, panel } from "../utils/dashboard.js";

export default function Competitors({ user }) {
  const { message, selectedWebsite, selectedWebsiteId, setMessage } = useWorkspaceData();
  const [analysis, setAnalysis] = useState(null);

  const handleCompare = async () => {
    if (!selectedWebsiteId) return;
    setMessage("");
    try {
      const res = await getCompetitorAnalysis(selectedWebsiteId);
      setAnalysis(res.data);
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not run competitor comparison."));
    }
  };

  const chartData = analysis
    ? [
        { domain: analysis.own.domain, seo: analysis.own.seoScore, speed: analysis.own.pageSpeedScore, issues: analysis.own.technicalIssuesCount },
        ...analysis.competitors.map((competitor) => ({
          domain: competitor.domain,
          seo: competitor.seoScore,
          speed: competitor.pageSpeedScore,
          issues: competitor.technicalIssuesCount,
        })),
      ]
    : [];

  return (
    <AppLayout user={user}>
      <div className={pageShell}>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold">Competitor analysis</h1>
            <p className="mt-2 text-sm text-[#667085]">Compare SEO scores, speed, issue count, and ranking gaps.</p>
          </div>
          <button type="button" onClick={handleCompare} className={buttonDark} disabled={!selectedWebsite?.competitorWebsites?.length}>Compare</button>
        </div>
        {message && <div className="mt-4 rounded-lg border border-[#d9dde7] bg-white px-4 py-3 text-sm font-semibold text-[#344054]">{message}</div>}

        {!selectedWebsite?.competitorWebsites?.length && (
          <div className={`mt-6 ${panel}`}>
            <p className="text-sm text-[#667085]">Add competitor domains on the Websites page, then run comparison here.</p>
          </div>
        )}

        {analysis && (
          <>
            <section className={`mt-6 ${panel}`}>
              <h2 className="text-lg font-bold">Side-by-side metrics</h2>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid stroke="#e4e7ec" strokeDasharray="3 3" />
                    <XAxis dataKey="domain" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="seo" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="speed" fill="#059669" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="issues" fill="#dc6803" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-3">
              {chartData.map((item) => (
                <div key={item.domain} className={panel}>
                  <p className="text-xs font-bold uppercase text-[#667085]">{item.domain === analysis.own.domain ? "Your site" : "Competitor"}</p>
                  <h2 className="mt-2 font-bold">{item.domain}</h2>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-[#667085]">
                    <span>SEO {item.seo}</span>
                    <span>Speed {item.speed}</span>
                    <span>Issues {item.issues}</span>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
