import { useState } from "react";
import {
  analyzeKeyword,
  deleteKeyword,
  getKeywordSuggestions,
} from "../api/keyword.api.js";
import { useWorkspaceData } from "../hooks/useWorkspaceData.js";
import AppLayout from "../layouts/AppLayout.jsx";
import {
  buttonDark,
  buttonLight,
  getErrorMessage,
  input,
  pageShell,
  panel,
} from "../utils/dashboard.js";

export default function Keywords({ user }) {
  const {
    keywords,
    loadNotifications,
    message,
    selectedWebsiteId,
    setKeywords,
    setMessage,
  } = useWorkspaceData();
  const [keywordInput, setKeywordInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleAnalyze = async (event) => {
    event.preventDefault();
    if (!selectedWebsiteId || !keywordInput.trim()) return;
    setMessage("");
    try {
      const res = await analyzeKeyword({ websiteId: selectedWebsiteId, keyword: keywordInput });
      setKeywords((current) => [res.data, ...current.filter((item) => item._id !== res.data._id)]);
      setKeywordInput("");
      setMessage("Keyword analyzed and saved.");
      loadNotifications();
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not analyze keyword."));
    }
  };

  const handleIdeas = async () => {
    if (!selectedWebsiteId || !keywordInput.trim()) return;
    try {
      const res = await getKeywordSuggestions(selectedWebsiteId, keywordInput);
      setSuggestions(res.data);
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not load keyword ideas."));
    }
  };

  const handleDelete = async (keywordId) => {
    try {
      await deleteKeyword(keywordId);
      setKeywords((current) => current.filter((item) => item._id !== keywordId));
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not delete keyword."));
    }
  };

  return (
    <AppLayout user={user}>
      <div className={pageShell}>
        <h1 className="text-3xl font-bold">Keyword research</h1>
        <p className="mt-2 text-sm text-[#667085]">Track keywords, generate ideas, and review ranking difficulty.</p>
        {message && <div className="mt-4 rounded-lg border border-[#d9dde7] bg-white px-4 py-3 text-sm font-semibold text-[#344054]">{message}</div>}

        <section className={`mt-6 ${panel}`}>
          <form className="grid gap-3 lg:grid-cols-[1fr_auto_auto]" onSubmit={handleAnalyze}>
            <input value={keywordInput} onChange={(event) => setKeywordInput(event.target.value)} className={input} placeholder="digital marketing tools" />
            <button className={buttonDark} disabled={!selectedWebsiteId || !keywordInput.trim()}>Analyze</button>
            <button type="button" onClick={handleIdeas} className={buttonLight} disabled={!selectedWebsiteId || !keywordInput.trim()}>Ideas</button>
          </form>

          {suggestions.length > 0 && (
            <div className="mt-5 rounded-lg border border-[#e4e7ec] bg-[#f8fafc] p-4">
              <p className="text-xs font-bold uppercase text-[#667085]">Keyword ideas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button type="button" key={suggestion.keyword} onClick={() => setKeywordInput(suggestion.keyword)} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#344054] ring-1 ring-[#e4e7ec]">
                    {suggestion.keyword} - {Number(suggestion.searchVolume).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {keywords.map((keyword) => (
            <article key={keyword._id} className={panel}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">{keyword.keyword}</h2>
                  <p className="mt-1 text-sm text-[#667085]">{keyword.searchIntent} intent - {keyword.competitionLevel} competition</p>
                </div>
                <button type="button" onClick={() => handleDelete(keyword._id)} className="text-xs font-bold text-red-600">Delete</button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <span>Rank #{keyword.rankingPosition}</span>
                <span>Volume {Number(keyword.searchVolume).toLocaleString()}</span>
                <span>KD {keyword.keywordDifficulty}</span>
                <span>CTR {keyword.ctr}%</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#667085]">{keyword.aiSuggestion}</p>
            </article>
          ))}
          {!keywords.length && <div className={panel}><p className="text-sm text-[#667085]">No keywords yet. Analyze one to begin tracking.</p></div>}
        </section>
      </div>
    </AppLayout>
  );
}
