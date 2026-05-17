import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api.js";
import {
  createWebsite,
  getWebsites,
  runSeoAudit,
} from "../api/website.api.js";

const priorities = [
  "Rewrite missing meta descriptions",
  "Compress oversized product images",
  "Add internal links to ranking pages",
];

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [auditRunning, setAuditRunning] = useState(false);

  const selectedWebsite = useMemo(
    () => websites.find((website) => website._id === selectedWebsiteId),
    [selectedWebsiteId, websites],
  );

  const stats = [
    ["SEO Score", selectedWebsite?.seoScore || 0, "Quality"],
    ["Keywords", selectedWebsite?.keywordsRanked || 0, "Ranked"],
    ["Issues", selectedWebsite?.technicalIssues?.length || 0, "Open"],
    ["Traffic", selectedWebsite?.organicTraffic || 0, "Organic"],
  ];

  useEffect(() => {
    const loadWebsites = async () => {
      try {
        const res = await getWebsites();
        setWebsites(res.data);
        setSelectedWebsiteId(res.data[0]?._id || "");
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not load websites."));
      } finally {
        setStatus("ready");
      }
    };

    loadWebsites();
  }, []);

  const websiteForm = useFormik({
    initialValues: {
      websiteName: "",
      domain: "",
      category: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.websiteName.trim()) {
        errors.websiteName = "Website name is required";
      }

      if (!values.domain.trim()) {
        errors.domain = "Domain is required";
      }

      return errors;
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setMessage("");

      try {
        const res = await createWebsite(values);
        setWebsites((current) => [res.data, ...current]);
        setSelectedWebsiteId(res.data._id);
        resetForm();
        setMessage("Website added successfully.");
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not add website."));
      } finally {
        setSubmitting(false);
      }
    },
  });

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
      setMessage("SEO audit completed with mock metrics.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not run audit."));
    } finally {
      setAuditRunning(false);
    }
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
              Manage websites, run your first SEO audit, and track mock metrics
              while the deeper analyzer is being built.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAudit}
            disabled={auditRunning || !selectedWebsiteId}
            className="h-11 rounded-lg bg-[#101828] px-5 text-sm font-bold text-white transition hover:bg-[#1d2939] disabled:cursor-not-allowed disabled:bg-[#98a2b3]"
          >
            {auditRunning ? "Running audit..." : "Run audit"}
          </button>
        </section>

        {message && (
          <div className="mt-4 rounded-lg border border-[#d9dde7] bg-white px-4 py-3 text-sm font-semibold text-[#344054]">
            {message}
          </div>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.4fr]">
          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Add website</h2>
            <p className="mt-1 text-sm text-[#667085]">
              Create a tracked property, then run a mock SEO audit.
            </p>

            <form className="mt-6 space-y-4" onSubmit={websiteForm.handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#344054]">
                  Website name
                </label>
                <input
                  name="websiteName"
                  value={websiteForm.values.websiteName}
                  onChange={websiteForm.handleChange}
                  placeholder="Optivio blog"
                  className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
                />
                {websiteForm.errors.websiteName &&
                  websiteForm.touched.websiteName && (
                    <p className="mt-1 text-xs font-semibold text-red-600">
                      {websiteForm.errors.websiteName}
                    </p>
                  )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#344054]">
                  Domain
                </label>
                <input
                  name="domain"
                  value={websiteForm.values.domain}
                  onChange={websiteForm.handleChange}
                  placeholder="example.com"
                  className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
                />
                {websiteForm.errors.domain && websiteForm.touched.domain && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {websiteForm.errors.domain}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#344054]">
                  Category
                </label>
                <input
                  name="category"
                  value={websiteForm.values.category}
                  onChange={websiteForm.handleChange}
                  placeholder="SaaS, ecommerce, agency..."
                  className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
                />
              </div>

              <button
                type="submit"
                disabled={websiteForm.isSubmitting || !websiteForm.isValid}
                className="h-11 w-full rounded-lg bg-[#6d5dfc] px-4 text-sm font-bold text-white transition hover:bg-[#5a4ee8] disabled:cursor-not-allowed disabled:bg-[#a9a3f8]"
              >
                {websiteForm.isSubmitting ? "Adding..." : "Create website"}
              </button>
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
                onChange={(event) => setSelectedWebsiteId(event.target.value)}
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
                  No websites yet. Add one to unlock the first audit flow.
                </div>
              ) : (
                websites.map((website) => (
                  <button
                    type="button"
                    key={website._id}
                    onClick={() => setSelectedWebsiteId(website._id)}
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
                      <p className="text-sm font-bold text-[#101828]">
                        {website.seoScore || 0}/100
                      </p>
                      <p className="mt-1 text-xs text-[#667085]">
                        {website.lastAnalyzed
                          ? "Audit completed"
                          : "No audit yet"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Audit snapshot</h2>
                <p className="mt-1 text-sm text-[#667085]">
                  Basic mock metrics from the latest audit.
                </p>
              </div>
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-bold text-[#5a4ee8]">
                MVP
              </span>
            </div>

            <div className="mt-8 flex h-64 items-end gap-3">
              {[
                selectedWebsite?.seoScore || 0,
                selectedWebsite?.pageSpeed || 0,
                selectedWebsite?.mobileOptimizationScore || 0,
                selectedWebsite?.domainAuthority || 0,
                Math.min(selectedWebsite?.keywordsRanked || 0, 100),
                Math.min((selectedWebsite?.organicTraffic || 0) / 100, 100),
              ].map((height, index) => (
                <div
                  key={index}
                  className="flex flex-1 items-end rounded-t-lg bg-[#eef2ff]"
                  style={{ height: `${Math.max(height, 8)}%` }}
                >
                  <div className="h-2/3 w-full rounded-t-lg bg-[#6d5dfc]" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">AI priorities</h2>
            <p className="mt-1 text-sm text-[#667085]">
              Highest-impact fixes to handle first.
            </p>

            <div className="mt-6 space-y-3">
              {(selectedWebsite?.aiRecommendations?.length
                ? selectedWebsite.aiRecommendations
                : priorities
              ).map((priority, index) => (
                <div
                  key={priority}
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
      </main>
    </div>
  );
}
