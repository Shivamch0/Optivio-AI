export const emptyWebsiteForm = {
  websiteName: "",
  domain: "",
  category: "",
  description: "",
  competitorWebsites: "",
};

export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const data = error?.response?.data;
  const details = Array.isArray(data?.errors)
    ? data.errors.filter(Boolean)
    : [];

  if (data?.message && details.length) {
    const uniqueDetails = [...new Set(details)].filter((item) => item !== data.message);
    return uniqueDetails.length
      ? `${data.message} ${uniqueDetails.join(" ")}`
      : data.message;
  }

  if (data?.message) return data.message;
  if (error?.response?.status === 401) return "Your session has expired. Please log in again.";
  if (error?.response?.status === 403) return "You do not have permission to perform this action.";
  if (error?.response?.status === 404) return "We could not find what you requested. Please refresh and try again.";
  if (error?.response?.status >= 500) return "The server is having trouble right now. Please try again in a moment.";
  if (error?.code === "ERR_NETWORK") return "Could not reach the server. Check your internet connection or API URL.";
  if (error?.message === "Network Error") return "Could not reach the server. Check your internet connection or API URL.";

  return fallback;
};

export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "Not run";

export const scoreTone = (score = 0) => {
  if (score >= 80) return "text-emerald-700 bg-emerald-50";
  if (score >= 60) return "text-amber-700 bg-amber-50";
  return "text-red-700 bg-red-50";
};

export const toWebsiteForm = (website) => ({
  websiteName: website?.websiteName || "",
  domain: website?.domain || "",
  category: website?.category || "",
  description: website?.description || "",
  competitorWebsites: website?.competitorWebsites?.join(", ") || "",
});

export const buildTrendData = (reports = []) =>
  reports
    .slice(0, 8)
    .reverse()
    .map((report) => ({
      date: formatDate(report.analyzedAt).split(",")[0],
      seo: report.seoScore || 0,
      speed: report.pageSpeedScore || 0,
      issues: report.technicalIssues?.length || 0,
    }));

export const pageShell = "mx-auto w-full max-w-7xl px-4 py-4 lg:px-6";
export const panel = "rounded-lg border border-[#dde3ee] bg-white p-4 shadow-sm";
export const input =
  "h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15";
export const buttonDark =
  "h-11 rounded-lg bg-[#101828] px-4 text-sm font-bold text-white transition hover:bg-[#1d2939] disabled:cursor-not-allowed disabled:bg-[#98a2b3]";
export const buttonLight =
  "h-11 rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm font-bold text-[#344054] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:text-[#98a2b3]";
