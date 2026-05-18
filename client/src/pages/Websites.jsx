import { useEffect, useState } from "react";
import {
  createWebsite,
  deleteWebsite,
  runSeoAudit,
  updateWebsite,
} from "../api/website.api.js";
import { useWorkspaceData } from "../hooks/useWorkspaceData.js";
import AppLayout from "../layouts/AppLayout.jsx";
import { LoadingPanel } from "../components/common/LoadingState.jsx";
import {
  buttonDark,
  buttonLight,
  emptyWebsiteForm,
  formatDate,
  getErrorMessage,
  input,
  pageShell,
  panel,
  scoreTone,
  toWebsiteForm,
} from "../utils/dashboard.js";

export default function Websites({ user }) {
  const {
    loadNotifications,
    loadWebsiteDetails,
    loadWebsites,
    loading,
    message,
    selectedWebsite,
    selectedWebsiteId,
    setMessage,
    setReports,
    setSelectedWebsiteId,
    setWebsites,
    websites,
  } = useWorkspaceData();
  const [form, setForm] = useState(emptyWebsiteForm);
  const [saving, setSaving] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      setForm(selectedWebsite ? toWebsiteForm(selectedWebsite) : emptyWebsiteForm);
    });
  }, [selectedWebsite]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const formPayload = () => ({
    ...form,
    competitorWebsites: form.competitorWebsites
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  });

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await createWebsite(formPayload());
      setSelectedWebsiteId(res.data._id);
      await loadWebsites(res.data._id);
      setMessage("Website added successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not add website."));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedWebsiteId) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await updateWebsite(selectedWebsiteId, formPayload());
      setWebsites((current) =>
        current.map((website) =>
          website._id === selectedWebsiteId ? res.data : website,
        ),
      );
      setMessage("Website updated successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not update website."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedWebsiteId) return;
    if (!window.confirm("Delete this website and its audit history?")) return;
    setDeleting(true);
    try {
      await deleteWebsite(selectedWebsiteId);
      const remaining = websites.filter((website) => website._id !== selectedWebsiteId);
      setWebsites(remaining);
      setSelectedWebsiteId(remaining[0]?._id || "");
      setMessage("Website deleted.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not delete website."));
    } finally {
      setDeleting(false);
    }
  };

  const handleAudit = async () => {
    if (!selectedWebsiteId) return;
    setMessage("Running audit.");
    setAuditing(true);
    try {
      const res = await runSeoAudit(selectedWebsiteId);
      setWebsites((current) =>
        current.map((website) =>
          website._id === selectedWebsiteId ? res.data.website : website,
        ),
      );
      setReports((current) => [res.data.report, ...current]);
      setMessage("Audit completed.");
      loadWebsiteDetails();
      loadNotifications();
    } catch (error) {
      setMessage(getErrorMessage(error, "Audit failed. Check the domain and try again."));
    } finally {
      setAuditing(false);
    }
  };

  return (
    <AppLayout user={user}>
      <div className={pageShell}>
        <h1 className="text-3xl font-bold">Websites</h1>
        <p className="mt-2 text-sm text-[#667085]">Add, edit, delete, and select tracked properties.</p>
        {message && <div className="mt-4 rounded-lg border border-[#d9dde7] bg-white px-4 py-3 text-sm font-semibold text-[#344054]">{message}</div>}

        {loading ? (
          <div className="mt-6">
            <LoadingPanel label="Loading websites" detail="Finding tracked properties and the latest selected site..." />
          </div>
        ) : (
        <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <form className={panel} onSubmit={handleCreate}>
            <h2 className="text-lg font-bold">Website manager</h2>
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-medium text-[#344054]">Website name<input name="websiteName" value={form.websiteName} onChange={updateForm} className={`mt-2 ${input}`} placeholder="Optivio blog" /></label>
              <label className="text-sm font-medium text-[#344054]">Domain<input name="domain" value={form.domain} onChange={updateForm} className={`mt-2 ${input}`} placeholder="example.com" /></label>
              <label className="text-sm font-medium text-[#344054]">Category<input name="category" value={form.category} onChange={updateForm} className={`mt-2 ${input}`} placeholder="SaaS" /></label>
              <label className="text-sm font-medium text-[#344054]">Competitors<input name="competitorWebsites" value={form.competitorWebsites} onChange={updateForm} className={`mt-2 ${input}`} placeholder="competitor.com, rival.com" /></label>
              <label className="text-sm font-medium text-[#344054]">Description<textarea name="description" value={form.description} onChange={updateForm} rows={3} className="mt-2 w-full rounded-lg border border-[#d0d5dd] px-3 py-3 text-sm outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15" /></label>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button className={buttonDark} disabled={saving || !form.websiteName || !form.domain}>
                {saving ? "Saving..." : "Add new"}
              </button>
              <button type="button" onClick={handleUpdate} className={buttonLight} disabled={saving || !selectedWebsiteId}>
                {saving ? "Updating..." : "Update"}
              </button>
              <button type="button" onClick={handleDelete} className={buttonLight} disabled={deleting || !selectedWebsiteId}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </form>

          <div className={panel}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Website list</h2>
              <button type="button" onClick={handleAudit} className={buttonDark} disabled={auditing || !selectedWebsiteId}>
                {auditing ? "Running..." : "Run audit"}
              </button>
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-[#e4e7ec]">
              {websites.map((website) => (
                <button
                  type="button"
                  key={website._id}
                  onClick={() => setSelectedWebsiteId(website._id)}
                  className={`flex w-full items-center justify-between gap-4 border-b border-[#e4e7ec] px-4 py-4 text-left last:border-b-0 ${selectedWebsiteId === website._id ? "bg-[#e9f1ff]" : "bg-white hover:bg-[#f8fafc]"}`}
                >
                  <div>
                    <p className="font-semibold">{website.websiteName}</p>
                    <p className="mt-1 text-sm text-[#667085]">{website.domain}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${scoreTone(website.seoScore)}`}>{website.seoScore || 0}/100</span>
                    <p className="mt-2 text-xs text-[#667085]">{formatDate(website.lastAnalyzed)}</p>
                  </div>
                </button>
              ))}
              {!websites.length && <p className="p-8 text-center text-sm text-[#667085]">No websites yet.</p>}
            </div>
          </div>
        </section>
        )}
      </div>
    </AppLayout>
  );
}
