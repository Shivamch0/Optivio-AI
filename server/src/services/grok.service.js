const XAI_CHAT_COMPLETIONS_URL = "https://api.x.ai/v1/chat/completions";

const parseRecommendations = (text = "") => {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    const items = Array.isArray(parsed) ? parsed : parsed.recommendations;

    if (Array.isArray(items)) {
      return items
        .map((item) => (typeof item === "string" ? item : item?.recommendation || item?.text))
        .filter(Boolean)
        .map((item) => item.trim())
        .slice(0, 4);
    }
  } catch {
    // Grok may still return markdown or numbered text; normalize that below.
  }

  return trimmed
    .split(/\n|(?<=\.)\s+(?=\d\.|-)/)
    .map((item) => item.replace(/^[-*\d.\s"']+/, "").replace(/["',\]]+$/, "").trim())
    .filter(Boolean)
    .slice(0, 4);
};

const generateGrokRecommendations = async ({ audit, website }) => {
  if (!process.env.XAI_API_KEY) {
    return [];
  }

  const prompt = `Return exactly 4 concise, high-impact SEO recommendations as a JSON array of strings for ${website.domain}. Use this audit data: ${JSON.stringify({
    seoScore: audit.seoScore,
    pageSpeedScore: audit.pageSpeedScore,
    titleTag: audit.titleTag,
    metaDescription: audit.metaDescription,
    h1TagsCount: audit.h1TagsCount,
    imageAltCoverage: audit.imageAltCoverage,
    brokenLinksCount: audit.brokenLinksCount,
    keywordDensity: audit.keywordDensity,
    technicalIssues: audit.technicalIssues,
  })}`;

  const controller = new AbortController();
  const timeoutMs = Number(process.env.XAI_TIMEOUT_MS) || 15000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(XAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.XAI_MODEL || "grok-4.3",
        messages: [
          {
            role: "system",
            content: "You are an SEO strategist. Reply only with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 450,
        stream: false,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return parseRecommendations(data.choices?.[0]?.message?.content);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
};

export { generateGrokRecommendations, parseRecommendations };
