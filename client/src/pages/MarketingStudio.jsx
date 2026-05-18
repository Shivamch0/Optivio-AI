import { useEffect, useMemo, useState } from "react";
import {
  generateCampaign,
  getCampaignExportUrl,
  getCampaigns,
  regenerateCampaign,
  toggleCampaignFavorite,
} from "../api/campaign.api.js";
import AppLayout from "../layouts/AppLayout.jsx";
import { LoadingPanel } from "../components/common/LoadingState.jsx";
import {
  buttonDark,
  buttonLight,
  getErrorMessage,
  input,
  pageShell,
  panel,
} from "../utils/dashboard.js";

const platforms = ["Google Ads", "Instagram", "Facebook", "LinkedIn", "YouTube"];
const goals = [
  ["sales", "Sales"],
  ["leads", "Leads"],
  ["awareness", "Awareness"],
  ["app_installs", "App installs"],
  ["traffic", "Traffic"],
];
const tones = ["professional", "luxury", "emotional", "funny", "startup", "minimal"];
const outputGroups = [
  ["headlines", "Headlines", "Responsive search ad headlines"],
  ["descriptions", "Descriptions", "Platform-ready primary text"],
  ["ctas", "CTAs", "Buttons and action prompts"],
  ["keywords", "Keywords", "SEO and paid-search targeting ideas"],
  ["hashtags", "Hashtags", "Social discovery tags"],
  ["captions", "Captions", "Feed and short post captions"],
  ["videoScripts", "Video Scripts", "Short-form ad script hooks"],
  ["emailSubjects", "Email", "Email subject line options"],
  ["landingPageCopy", "Landing Page", "Hero and conversion copy"],
  ["abVariations", "A/B Tests", "Ad variants for experiments"],
  ["optimizationSuggestions", "Optimization", "Keyword and campaign improvements"],
];

const emptyForm = {
  campaignName: "",
  businessName: "",
  industry: "",
  productDescription: "",
  audience: "",
  goal: "leads",
  tone: "professional",
  platforms: ["Google Ads", "Instagram"],
};

const scoreClass = (score = 0) => {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (score >= 60) return "bg-blue-50 text-blue-700 ring-blue-100";
  return "bg-amber-50 text-amber-700 ring-amber-100";
};

const SectionList = ({ description, favorites = [], items = [], onCopy, onFavorite, title }) => (
  <section className="rounded-lg border border-[#dbe4f0] bg-white p-4 shadow-sm">
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
      <div>
        <h3 className="text-base font-bold text-[#101828]">{title}</h3>
        <p className="mt-1 text-sm text-[#667085]">{description}</p>
      </div>
      <span className="w-fit rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#175cd3]">
        {items.length} assets
      </span>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {items.map((item) => {
        const text = typeof item === "string" ? item : `${item.headline} - ${item.description} - ${item.cta}`;
        return (
          <div key={text} className="rounded-lg border border-[#edf1f6] bg-[#f8fafc] p-4">
            {typeof item === "string" ? (
              <p className="text-sm leading-6 text-[#344054]">{item}</p>
            ) : (
              <div>
                <p className="text-sm font-bold text-[#101828]">{item.name}</p>
                <p className="mt-1 text-sm leading-6 text-[#344054]">{item.headline}</p>
                <p className="mt-1 text-sm leading-6 text-[#667085]">{item.description}</p>
                <p className="mt-2 text-xs font-bold uppercase text-[#175cd3]">{item.cta}</p>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onCopy(text)}
                className="h-9 rounded-md border border-[#d0d5dd] bg-white px-3 text-xs font-bold text-[#344054] transition hover:border-[#175cd3] hover:text-[#175cd3]"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => onFavorite(text)}
                className={`h-9 rounded-md px-3 text-xs font-bold transition ${
                  favorites.includes(text)
                    ? "bg-[#101828] text-white"
                    : "border border-[#d0d5dd] bg-white text-[#344054] hover:border-[#175cd3] hover:text-[#175cd3]"
                }`}
              >
                {favorites.includes(text) ? "Saved" : "Favorite"}
              </button>
            </div>
          </div>
        );
      })}
      {!items.length && <p className="text-sm text-[#667085]">Generate a campaign to fill this section.</p>}
    </div>
  </section>
);

export default function MarketingStudio({ user }) {
  const [form, setForm] = useState(emptyForm);
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [activePlatform, setActivePlatform] = useState("Google Ads");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [activeOutputGroup, setActiveOutputGroup] = useState("headlines");

  useEffect(() => {
    let mounted = true;

    getCampaigns()
      .then((res) => {
        if (!mounted) return;
        setCampaigns(res.data);
        setActiveCampaign(res.data[0] || null);
        setActivePlatform(res.data[0]?.generatedContent?.platforms?.[0]?.platform || "Google Ads");
      })
      .catch((error) => setMessage(getErrorMessage(error, "Could not load campaigns.")))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const activeContent = useMemo(
    () =>
      activeCampaign?.generatedContent?.platforms?.find(
        (item) => item.platform === activePlatform,
      ) || activeCampaign?.generatedContent?.platforms?.[0],
    [activeCampaign, activePlatform],
  );
  const activeGroup = outputGroups.find(([key]) => key === activeOutputGroup) || outputGroups[0];
  const activeItems = activeContent?.[activeGroup[0]] || [];

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const togglePlatform = (platform) => {
    setForm((current) => {
      const exists = current.platforms.includes(platform);
      const nextPlatforms = exists
        ? current.platforms.filter((item) => item !== platform)
        : [...current.platforms, platform];

      return { ...current, platforms: nextPlatforms };
    });
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Copied to clipboard.");
    } catch {
      setMessage("Copy is not available in this browser.");
    }
  };

  const favoriteText = async (text) => {
    if (!activeCampaign?._id) return;
    try {
      const res = await toggleCampaignFavorite(activeCampaign._id, text);
      setActiveCampaign(res.data);
      setCampaigns((current) =>
        current.map((campaign) => (campaign._id === res.data._id ? res.data : campaign)),
      );
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not update favorite."));
    }
  };

  const submitCampaign = async (event) => {
    event.preventDefault();
    setMessage("");
    setGenerating(true);
    try {
      const res = await generateCampaign(form);
      setCampaigns((current) => [res.data, ...current]);
      setActiveCampaign(res.data);
      setActivePlatform(res.data.generatedContent.platforms[0]?.platform || "Google Ads");
      setActiveOutputGroup("headlines");
      setMessage("Campaign generated and saved.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not generate campaign."));
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!activeCampaign?._id) return;
    setGenerating(true);
    try {
      const res = await regenerateCampaign(activeCampaign._id);
      setActiveCampaign(res.data);
      setActivePlatform(res.data.generatedContent.platforms[0]?.platform || activePlatform);
      setActiveOutputGroup("headlines");
      setCampaigns((current) =>
        current.map((campaign) => (campaign._id === res.data._id ? res.data : campaign)),
      );
      setMessage("Campaign regenerated.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not regenerate campaign."));
    } finally {
      setGenerating(false);
    }
  };

  const loadCampaign = (campaign) => {
    setActiveCampaign(campaign);
    setActivePlatform(campaign.generatedContent?.platforms?.[0]?.platform || "Google Ads");
    setActiveOutputGroup("headlines");
  };

  const shellTheme = darkMode ? "bg-[#0f172a] text-white" : "";
  const panelTheme = darkMode ? "border-[#263247] bg-[#111c31] text-white" : panel;
  const mutedText = darkMode ? "text-[#a8b3c7]" : "text-[#667085]";
  const activePlatforms = activeCampaign?.generatedContent?.platforms || [];

  return (
    <AppLayout user={user}>
      <div className={`${pageShell} ${shellTheme} min-h-dvh`}>
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-[#175cd3]">AI Marketing Studio</p>
            <h1 className="mt-2 text-3xl font-bold">Ad Copy Generator</h1>
            <p className={`mt-2 max-w-3xl text-sm leading-6 ${mutedText}`}>
              Generate platform-specific headlines, descriptions, CTAs, captions, keywords, video
              scripts, and campaign predictions from one structured brief.
            </p>
          </div>
        </section>

        {message && (
          <div className="mt-4 rounded-lg border border-[#d9dde7] bg-white px-4 py-3 text-sm font-semibold text-[#344054]">
            {message}
          </div>
        )}

        {loading ? (
          <div className="mt-6">
            <LoadingPanel label="Loading campaigns" detail="Finding your saved ad copy campaigns..." />
          </div>
        ) : (
          <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <form className={panelTheme} onSubmit={submitCampaign}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Create campaign</h2>
                  <p className={`mt-1 text-sm ${mutedText}`}>Brief the AI once, then adapt by platform.</p>
                </div>
                <span className="rounded-full bg-[#e9f1ff] px-3 py-1 text-xs font-bold text-[#175cd3]">
                  v1
                </span>
              </div>

              <div className="mt-5 grid gap-4">
                <label className="text-sm font-medium">
                  Campaign name
                  <input name="campaignName" value={form.campaignName} onChange={updateForm} className={`mt-2 ${input}`} placeholder="Q2 lead gen launch" />
                </label>
                <label className="text-sm font-medium">
                  Business name
                  <input name="businessName" value={form.businessName} onChange={updateForm} className={`mt-2 ${input}`} placeholder="Optivio AI" />
                </label>
                <label className="text-sm font-medium">
                  Industry/category
                  <input name="industry" value={form.industry} onChange={updateForm} className={`mt-2 ${input}`} placeholder="AI SEO software" />
                </label>
                <label className="text-sm font-medium">
                  Product/service description
                  <textarea
                    name="productDescription"
                    value={form.productDescription}
                    onChange={updateForm}
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-[#d0d5dd] px-3 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
                    placeholder="AI-powered SEO audits, keyword tracking, and growth recommendations."
                  />
                </label>
                <label className="text-sm font-medium">
                  Target audience
                  <input name="audience" value={form.audience} onChange={updateForm} className={`mt-2 ${input}`} placeholder="B2B founders and marketing teams" />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium">
                    Marketing goal
                    <select name="goal" value={form.goal} onChange={updateForm} className={`mt-2 ${input}`}>
                      {goals.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-medium">
                    Brand tone
                    <select name="tone" value={form.tone} onChange={updateForm} className={`mt-2 ${input}`}>
                      {tones.map((tone) => (
                        <option key={tone} value={tone}>{tone}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <p className="text-sm font-medium">Platforms</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {platforms.map((platform) => (
                      <button
                        type="button"
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        className={`h-10 rounded-lg text-xs font-bold ${
                          form.platforms.includes(platform)
                            ? "bg-[#101828] text-white"
                            : "border border-[#d0d5dd] bg-white text-[#344054]"
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button className={`mt-5 w-full ${buttonDark}`} disabled={generating}>
                {generating ? "Generating campaign..." : "Generate ad copy"}
              </button>
            </form>

            <div className="grid gap-6">
              <section className={`${panelTheme} overflow-hidden`}>
                <div className="flex flex-col justify-between gap-4 border-b border-[#e4e7ec] pb-5 md:flex-row md:items-start">
                  <div>
                    <h2 className="text-lg font-bold">{activeCampaign?.campaignName || "Generated Ads Preview"}</h2>
                    <p className={`mt-1 text-sm ${mutedText}`}>
                      {activeCampaign
                        ? `${activeCampaign.businessName} - ${activeCampaign.audience}`
                        : "Your generated assets will appear here."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      className={`${buttonLight} inline-flex items-center gap-2`}
                      disabled={generating || !activeCampaign}
                    >
                      <span aria-hidden="true">R</span>
                      {generating ? "Regenerating..." : "Regenerate"}
                    </button>
                    {activeCampaign && (
                      <a
                        href={getCampaignExportUrl(activeCampaign._id)}
                        className={`${buttonDark} inline-flex items-center justify-center gap-2`}
                      >
                        <span aria-hidden="true">PDF</span>
                        Export PDF
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Predicted CTR", activeCampaign?.analytics?.predictedCTR || 0],
                    ["Engagement", activeCampaign?.analytics?.engagementScore || 0],
                    ["Conversion", activeCampaign?.analytics?.conversionScore || 0],
                  ].map(([label, value]) => (
                    <div key={label} className={`rounded-lg px-4 py-3 ring-1 ${scoreClass(value)}`}>
                      <p className="text-xs font-bold uppercase">{label}</p>
                      <p className="mt-2 text-2xl font-bold">{value}%</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase text-[#667085]">Platform</p>
                      <p className="mt-1 text-sm font-semibold">
                        {activeContent?.platform || "Select a platform"} content preview
                      </p>
                    </div>
                    {activeCampaign && (
                      <span className="rounded-full bg-[#f2f4f7] px-3 py-1 text-xs font-bold text-[#344054]">
                        {activeCampaign.platforms.length} platforms
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {activePlatforms.map((item) => (
                    <button
                      type="button"
                      key={item.platform}
                      onClick={() => setActivePlatform(item.platform)}
                      className={`rounded-lg border px-3 py-3 text-left text-sm font-bold transition ${
                        activePlatform === item.platform
                          ? "border-[#175cd3] bg-[#e9f1ff] text-[#175cd3] shadow-sm"
                          : "border-[#d0d5dd] bg-white text-[#344054] hover:border-[#175cd3]"
                      }`}
                    >
                      <span className="block">{item.platform}</span>
                      <span className="mt-1 block text-xs font-semibold opacity-70">
                        {item.headlines?.length || 0} headlines - {item.descriptions?.length || 0} descriptions
                      </span>
                    </button>
                  ))}
                </div>

                {activeContent && (
                  <div className="mt-5 rounded-lg border border-[#e4e7ec] bg-[#f8fafc] p-3">
                    <p className="text-xs font-bold uppercase text-[#667085]">Output Type</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {outputGroups.map(([key, label]) => (
                        <button
                          type="button"
                          key={key}
                          onClick={() => setActiveOutputGroup(key)}
                          className={`h-10 rounded-lg px-3 text-left text-xs font-bold transition ${
                            activeOutputGroup === key
                              ? "bg-[#101828] text-white"
                              : "bg-white text-[#344054] ring-1 ring-[#e4e7ec] hover:ring-[#175cd3]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {activeContent ? (
                <SectionList
                  title={`${activeContent.platform} ${activeGroup[1]}`}
                  description={activeGroup[2]}
                  items={activeItems}
                  onCopy={copyText}
                  onFavorite={favoriteText}
                  favorites={activeCampaign.favorites}
                />
              ) : (
                <section className="rounded-lg border border-dashed border-[#cbd5e1] bg-white p-8 text-center">
                  <p className="text-sm font-semibold text-[#344054]">No campaign generated yet.</p>
                  <p className="mt-2 text-sm text-[#667085]">Fill out the brief and generate your first ad set.</p>
                </section>
              )}
            </div>

            <section className={`${panelTheme} xl:col-span-2`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Campaign history</h2>
                <span className={`text-sm font-semibold ${mutedText}`}>{campaigns.length} saved</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {campaigns.map((campaign) => (
                  <button
                    type="button"
                    key={campaign._id}
                    onClick={() => loadCampaign(campaign)}
                    className={`rounded-lg border p-4 text-left transition ${
                      activeCampaign?._id === campaign._id
                        ? "border-[#175cd3] bg-[#e9f1ff]"
                        : "border-[#e4e7ec] bg-white hover:bg-[#f8fafc]"
                    }`}
                  >
                    <p className="font-bold text-[#101828]">{campaign.campaignName}</p>
                    <p className="mt-1 text-sm text-[#667085]">{campaign.businessName}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {campaign.platforms.slice(0, 3).map((platform) => (
                        <span key={platform} className="rounded-full bg-[#f2f4f7] px-2 py-1 text-xs font-bold text-[#344054]">
                          {platform}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs font-bold text-[#175cd3]">
                      {campaign.analytics?.predictedCTR || 0}% predicted CTR
                    </p>
                  </button>
                ))}
                {!campaigns.length && <p className={`text-sm ${mutedText}`}>No saved campaigns yet.</p>}
              </div>
            </section>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
