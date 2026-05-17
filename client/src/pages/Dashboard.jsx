import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api.js";
import {
  createWebsite,
  deleteWebsite,
  getSeoReports,
  getWebsites,
  runSeoAudit,
  updateWebsite,
} from "../api/website.api.js";
import {
  analyzeKeyword,
  deleteKeyword,
  getKeywords,
} from "../api/keyword.api.js";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notification.api.js";

const emptyWebsiteForm = {
  websiteName: "",
  domain: "",
  category: "",
  description: "",
  competitorWebsites: "",
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "Not run";

const scoreTone = (score = 0) => {
  if (score >= 80) return "text-emerald-700 bg-emerald-50";
  if (score >= 60) return "text-amber-700 bg-amber-50";
  return "text-red-700 bg-red-50";
};

const toWebsiteForm = (website) => ({
  websiteName: website?.websiteName || "",
  domain: website?.domain || "",
  category: website?.category || "",
  description: website?.description || "",
  competitorWebsites: website?.competitorWebsites?.join(", ") || "",
});

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState("");
  const [websiteForm, setWebsiteForm] = useState(emptyWebsiteForm);
  const [keywordInput, setKeywordInput] = useState("");
  const [reports, setReports] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [auditRunning, setAuditRunning] = useState(false);
  const [savingWebsite, setSavingWebsite] = useState(false);
  const [keywordRunning, setKeywordRunning] = useState(false);

  const selectedWebsite = useMemo(
    () => websites.find((website) => website._id === selectedWebsiteId),
    [selectedWebsiteId, websites],
  );

  const latestReport = reports[0];
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const stats = [
    ["SEO Score", selectedWebsite?.seoScore || 0, "Quality"],
    ["Keywords", selectedWebsite?.keywordsRanked || keywords.length || 0, "Tracked"],
    ["Issues", selectedWebsite?.technicalIssues?.length || 0, "Open"],
    ["Traffic", selectedWebsite?.organicTraffic || 0, "Organic"],
  ];

  const loadNotifications = useCallback(async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch {
      setNotifications([]);
    }
  }, []);

  const loadWorkspace = useCallback(async (preferredWebsiteId = "") => {
    try {
      const res = await getWebsites();
      setWebsites(res.data);
      const nextId = preferredWebsiteId || res.data[0]?._id || "";
      const nextWebsite = res.data.find((website) => website._id === nextId);
      setSelectedWebsiteId(nextId);
      setWebsiteForm(nextWebsite ? toWebsiteForm(nextWebsite) : emptyWebsiteForm);
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not load websites."));
    } finally {
      setStatus("ready");
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      loadWorkspace();
      loadNotifications();
    });
  }, [loadNotifications, loadWorkspace]);

  useEffect(() => {
    const loadWebsiteDetails = async () => {
      if (!selectedWebsiteId) {
        setReports([]);
        setKeywords([]);
        return;
      }

      try {
        const [reportRes, keywordRes] = await Promise.all([
          getSeoReports(selectedWebsiteId),
          getKeywords(selectedWebsiteId),
        ]);
        setReports(reportRes.data);
        setKeywords(keywordRes.data);
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not load website details."));
      }
    };

    loadWebsiteDetails();
  }, [selectedWebsiteId]);

  const handleWebsiteField = (event) => {
    const { name, value } = event.target;
    setWebsiteForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateWebsite = async (event) => {
    event.preventDefault();
    setSavingWebsite(true);
    setMessage("");

    try {
      const res = await createWebsite(websiteForm);
      setWebsites((current) => [res.data, ...current]);
      setSelectedWebsiteId(res.data._id);
      setWebsiteForm(toWebsiteForm(res.data));
      setMessage("Website added successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not add website."));
    } finally {
      setSavingWebsite(false);
    }
  };

  const handleUpdateWebsite = async () => {
    if (!selectedWebsiteId) return;
    setSavingWebsite(true);
    setMessage("");

    try {
      const payload = {
        ...websiteForm,
        competitorWebsites: websiteForm.competitorWebsites
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const res = await updateWebsite(selectedWebsiteId, payload);
      setWebsites((current) =>
        current.map((website) =>
          website._id === selectedWebsiteId ? res.data : website,
        ),
      );
      setMessage("Website updated successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not update website."));
    } finally {
      setSavingWebsite(false);
    }
  };

  const handleDeleteWebsite = async () => {
    if (!selectedWebsiteId) return;
    const confirmed = window.confirm("Delete this website and its audit history?");
    if (!confirmed) return;

    try {
      await deleteWebsite(selectedWebsiteId);
      const remaining = websites.filter((website) => website._id !== selectedWebsiteId);
      const nextWebsite = remaining[0];
      setWebsites(remaining);
      setSelectedWebsiteId(nextWebsite?._id || "");
      setWebsiteForm(nextWebsite ? toWebsiteForm(nextWebsite) : emptyWebsiteForm);
      setMessage("Website deleted.");
      loadNotifications();
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not delete website."));
    }
  };

  const handleAudit = async () => {
    if (!selectedWebsiteId) {
      setMessage("Create a website before running an audit.");
      return;
    }

    setAuditRunning(true);
    setMessage("");

    try {
      const res = await runSeoAudit(selectedWebsiteId);
      setWebsites((current) =>
        current.map((website) =>
          website._id === selectedWebsiteId ? res.data.website : website,
        ),
      );
      setReports((current) => [res.data.report, ...current]);
      setMessage("SEO audit completed. Real page analysis was attempted with a fallback when blocked.");
      loadNotifications();
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not run audit."));
    } finally {
      setAuditRunning(false);
    }
  };

  const handleAnalyzeKeyword = async (event) => {
    event.preventDefault();
    if (!selectedWebsiteId || !keywordInput.trim()) return;

    setKeywordRunning(true);
    setMessage("");

    try {
      const res = await analyzeKeyword({
        websiteId: selectedWebsiteId,
        keyword: keywordInput,
      });
      setKeywords((current) => {
        const withoutDuplicate = current.filter((item) => item._id !== res.data._id);
        return [res.data, ...withoutDuplicate];
      });
      setWebsites((current) =>
        current.map((website) =>
          website._id === selectedWebsiteId
            ? { ...website, keywordsRanked: Math.max(website.keywordsRanked || 0, keywords.length + 1) }
            : website,
        ),
      );
      setKeywordInput("");
      setMessage("Keyword analyzed and saved.");
      loadNotifications();
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not analyze keyword."));
    } finally {
      setKeywordRunning(false);
    }
  };

  const handleDeleteKeyword = async (keywordId) => {
    try {
      await deleteKeyword(keywordId);
      setKeywords((current) => current.filter((item) => item._id !== keywordId));
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not delete keyword."));
    }
  };

  const handleMarkRead = async (notificationId) => {
    await markNotificationRead(notificationId);
    setNotifications((current) =>
      current.map((item) =>
        item._id === notificationId ? { ...item, isRead: true } : item,
      ),
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  const handleDeleteNotification = async (notificationId) => {
    await deleteNotification(notificationId);
    setNotifications((current) => current.filter((item) => item._id !== notificationId));
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] text-[#101828]">
      <header className="border-b border-[#dde3ee] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6d5dfc] text-sm font-bold text-white">
              O
            </span>
            <div>
              <p className="font-bold">Optivio AI</p>
              <p className="text-xs text-[#667085]">Search intelligence</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[#d0d5dd] bg-white px-4 py-2 text-sm font-semibold text-[#344054] transition hover:bg-[#f8fafc]"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <section className="flex flex-col justify-between gap-6 rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#6d5dfc]">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome, {user?.userName || "there"}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">
              Manage websites, run SEO audits, track keywords, review audit history,
              and act on alerts from one workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAudit}
            disabled={auditRunning || !selectedWebsiteId}
            className="h-11 rounded-lg bg-[#101828] px-5 text-sm font-bold text-white transition hover:bg-[#1d2939] disabled:cursor-not-allowed disabled:bg-[#98a2b3]"
          >
            {auditRunning ? "Running audit..." : "Run SEO audit"}
          </button>
        </section>

        {message && (
          <div className="mt-4 rounded-lg border border-[#d9dde7] bg-white px-4 py-3 text-sm font-semibold text-[#344054]">
            {message}
          </div>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Website manager</h2>
                <p className="mt-1 text-sm text-[#667085]">
                  Add, edit, or remove tracked properties.
                </p>
              </div>
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-bold text-[#5a4ee8]">
                {websites.length}
              </span>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleCreateWebsite}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#344054]">
                  Website name
                </label>
                <input
                  name="websiteName"
                  value={websiteForm.websiteName}
                  onChange={handleWebsiteField}
                  placeholder="Optivio blog"
                  className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#344054]">
                  Domain
                </label>
                <input
                  name="domain"
                  value={websiteForm.domain}
                  onChange={handleWebsiteField}
                  placeholder="example.com"
                  className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#344054]">
                    Category
                  </label>
                  <input
                    name="category"
                    value={websiteForm.category}
                    onChange={handleWebsiteField}
                    placeholder="SaaS"
                    className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#344054]">
                    Competitors
                  </label>
                  <input
                    name="competitorWebsites"
                    value={websiteForm.competitorWebsites}
                    onChange={handleWebsiteField}
                    placeholder="a.com, b.com"
                    className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#344054]">
                  Description
                </label>
                <textarea
                  name="description"
                  value={websiteForm.description}
                  onChange={handleWebsiteField}
                  rows={3}
                  placeholder="Primary market, product focus, or SEO notes"
                  className="w-full rounded-lg border border-[#d0d5dd] px-3 py-3 text-sm outline-none focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="submit"
                  disabled={savingWebsite || !websiteForm.websiteName || !websiteForm.domain}
                  className="h-11 rounded-lg bg-[#6d5dfc] px-4 text-sm font-bold text-white transition hover:bg-[#5a4ee8] disabled:cursor-not-allowed disabled:bg-[#a9a3f8]"
                >
                  {savingWebsite ? "Saving..." : "Add new"}
                </button>
                <button
                  type="button"
                  onClick={handleUpdateWebsite}
                  disabled={savingWebsite || !selectedWebsiteId}
                  className="h-11 rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm font-bold text-[#344054] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:text-[#98a2b3]"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleDeleteWebsite}
                  disabled={!selectedWebsiteId}
                  className="h-11 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:text-red-300"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">Websites</h2>
                <p className="mt-1 text-sm text-[#667085]">
                  {status === "loading"
                    ? "Loading workspace..."
                    : `${websites.length} tracked properties`}
                </p>
              </div>

              <select
                value={selectedWebsiteId}
                onChange={(event) => {
                  const nextId = event.target.value;
                  setSelectedWebsiteId(nextId);
                  setWebsiteForm(
                    toWebsiteForm(websites.find((website) => website._id === nextId)),
                  );
                }}
                className="h-11 rounded-lg border border-[#d0d5dd] bg-white px-3 text-sm font-semibold text-[#344054] outline-none"
              >
                <option value="">Select website</option>
                {websites.map((website) => (
                  <option key={website._id} value={website._id}>
                    {website.domain}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(([label, value, helper]) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#e4e7ec] bg-[#f8fafc] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                    {label}
                  </p>
                  <p className="mt-3 text-2xl font-bold">
                    {Number(value).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-[#667085]">{helper}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-[#e4e7ec]">
              {websites.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#667085]">
                  No websites yet. Add one to unlock audits, keywords, and history.
                </div>
              ) : (
                websites.map((website) => (
                  <button
                    type="button"
                    key={website._id}
                    onClick={() => {
                      setSelectedWebsiteId(website._id);
                      setWebsiteForm(toWebsiteForm(website));
                    }}
                    className={`flex w-full items-center justify-between gap-4 border-b border-[#e4e7ec] px-4 py-4 text-left last:border-b-0 ${
                      selectedWebsiteId === website._id
                        ? "bg-[#eef2ff]"
                        : "bg-white hover:bg-[#f8fafc]"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-[#101828]">
                        {website.websiteName}
                      </p>
                      <p className="mt-1 text-sm text-[#667085]">
                        {website.domain}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${scoreTone(website.seoScore)}`}>
                        {website.seoScore || 0}/100
                      </span>
                      <p className="mt-2 text-xs text-[#667085]">
                        {formatDate(website.lastAnalyzed)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Audit snapshot</h2>
                <p className="mt-1 text-sm text-[#667085]">
                  Latest report metrics and issue breakdown.
                </p>
              </div>
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-bold text-[#5a4ee8]">
                {latestReport ? "Live" : "Waiting"}
              </span>
            </div>

            <div className="mt-8 flex h-60 items-end gap-3">
              {[
                ["SEO", selectedWebsite?.seoScore || 0],
                ["Speed", selectedWebsite?.pageSpeed || 0],
                ["Mobile", selectedWebsite?.mobileOptimizationScore || 0],
                ["Authority", selectedWebsite?.domainAuthority || 0],
                ["Alt", latestReport?.imageAltCoverage || 0],
                ["Links", Math.min(latestReport?.internalLinksCount || 0, 100)],
              ].map(([label, height]) => (
                <div key={label} className="flex flex-1 flex-col justify-end gap-2">
                  <div
                    className="flex items-end rounded-t-lg bg-[#eef2ff]"
                    style={{ height: `${Math.max(height, 8)}%` }}
                  >
                    <div className="h-2/3 w-full rounded-t-lg bg-[#6d5dfc]" />
                  </div>
                  <p className="text-center text-xs font-semibold text-[#667085]">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {(selectedWebsite?.technicalIssues || []).slice(0, 3).map((issue) => (
                <div key={issue.issue} className="rounded-lg border border-[#e4e7ec] p-4">
                  <p className="text-xs font-bold uppercase text-[#667085]">
                    {issue.severity}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#344054]">
                    {issue.issue}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">AI priorities</h2>
            <p className="mt-1 text-sm text-[#667085]">
              Recommendations from the latest audit.
            </p>

            <div className="mt-6 space-y-3">
              {(selectedWebsite?.aiRecommendations?.length
                ? selectedWebsite.aiRecommendations
                : ["Run an audit to generate priorities."]).map((priority, index) => (
                <div
                  key={`${priority}-${index}`}
                  className="flex gap-3 rounded-lg border border-[#e4e7ec] p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#101828] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium leading-6 text-[#344054]">
                    {priority}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Audit history</h2>
                <p className="mt-1 text-sm text-[#667085]">
                  Stored reports for the selected website.
                </p>
              </div>
              <span className="text-sm font-bold text-[#344054]">{reports.length}</span>
            </div>

            <div className="mt-6 space-y-3">
              {reports.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[#d0d5dd] p-6 text-center text-sm text-[#667085]">
                  No audit reports yet.
                </p>
              ) : (
                reports.slice(0, 6).map((report) => (
                  <div key={report._id} className="rounded-lg border border-[#e4e7ec] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#101828]">
                          {formatDate(report.analyzedAt)}
                        </p>
                        <p className="mt-1 text-sm text-[#667085]">
                          {report.titleTag || "No title found"}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${scoreTone(report.seoScore)}`}>
                        {report.seoScore}/100
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-[#667085] sm:grid-cols-3">
                      <span>Speed {report.pageSpeedScore}</span>
                      <span>Broken {report.brokenLinksCount}</span>
                      <span>H1 {report.h1TagsCount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Keyword tracker</h2>
                <p className="mt-1 text-sm text-[#667085]">
                  Analyze and save ranking opportunities.
                </p>
              </div>
              <span className="text-sm font-bold text-[#344054]">{keywords.length}</span>
            </div>

            <form className="mt-6 flex gap-3" onSubmit={handleAnalyzeKeyword}>
              <input
                value={keywordInput}
                onChange={(event) => setKeywordInput(event.target.value)}
                placeholder="digital marketing"
                className="h-11 min-w-0 flex-1 rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
              />
              <button
                type="submit"
                disabled={keywordRunning || !selectedWebsiteId || !keywordInput.trim()}
                className="h-11 rounded-lg bg-[#101828] px-4 text-sm font-bold text-white transition hover:bg-[#1d2939] disabled:cursor-not-allowed disabled:bg-[#98a2b3]"
              >
                {keywordRunning ? "Analyzing..." : "Analyze"}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {keywords.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[#d0d5dd] p-6 text-center text-sm text-[#667085]">
                  No keywords yet.
                </p>
              ) : (
                keywords.slice(0, 6).map((keyword) => (
                  <div key={keyword._id} className="rounded-lg border border-[#e4e7ec] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#101828]">
                          {keyword.keyword}
                        </p>
                        <p className="mt-1 text-sm text-[#667085]">
                          {keyword.searchIntent} intent - {keyword.competitionLevel} competition
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteKeyword(keyword._id)}
                        className="text-xs font-bold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 text-xs sm:grid-cols-4">
                      <span>Rank #{keyword.rankingPosition}</span>
                      <span>Vol {Number(keyword.searchVolume).toLocaleString()}</span>
                      <span>KD {keyword.keywordDifficulty}</span>
                      <span>Trend {keyword.trend}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold">Notifications</h2>
              <p className="mt-1 text-sm text-[#667085]">
                Audit completions, ranking updates, and SEO alerts.
              </p>
            </div>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={!unreadCount}
              className="h-10 rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm font-bold text-[#344054] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:text-[#98a2b3]"
            >
              Mark all read ({unreadCount})
            </button>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {notifications.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#d0d5dd] p-6 text-center text-sm text-[#667085] lg:col-span-3">
                No notifications yet.
              </p>
            ) : (
              notifications.slice(0, 9).map((notification) => (
                <div
                  key={notification._id}
                  className={`rounded-lg border p-4 ${
                    notification.isRead
                      ? "border-[#e4e7ec] bg-white"
                      : "border-[#c7d2fe] bg-[#eef2ff]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#101828]">
                        {notification.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#667085]">
                        {notification.message}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[11px] font-bold uppercase text-[#667085]">
                      {notification.priority}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notification._id)}
                        className="text-xs font-bold text-[#5a4ee8]"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="text-xs font-bold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
