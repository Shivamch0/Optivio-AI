const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_GENERATE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const goalLabels = {
  sales: "drive purchases",
  leads: "capture qualified leads",
  awareness: "increase brand awareness",
  app_installs: "increase app installs",
  traffic: "increase high-intent traffic",
};

const tonePhrases = {
  professional: ["trusted", "measurable", "built for teams"],
  luxury: ["premium", "elevated", "crafted for discerning buyers"],
  emotional: ["confidence", "relief", "made for moments that matter"],
  funny: ["no guesswork", "less chaos", "finally simple"],
  startup: ["move faster", "launch smarter", "scale with clarity"],
  minimal: ["simple", "focused", "clear"],
};

const platformAngles = {
  "Google Ads": "search intent",
  Instagram: "visual discovery",
  Facebook: "community and retargeting",
  LinkedIn: "professional decision makers",
  YouTube: "short-form video attention",
};

const clampScore = (value) => Math.max(1, Math.min(99, Math.round(value)));

const seedFrom = (value = "") =>
  value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);

const normalizeList = (items = [], fallback = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 10)
    .concat(fallback)
    .filter((item, index, list) => item && list.indexOf(item) === index)
    .slice(0, 10);

const stripJsonFence = (text = "") =>
  text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

const buildKeywords = ({ industry, productDescription, audience, businessName }) => {
  const words = `${industry} ${productDescription} ${audience} ${businessName}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);
  const unique = [...new Set(words)].slice(0, 8);

  return [
    `${industry} solutions`.toLowerCase(),
    `${businessName} ${industry}`.toLowerCase(),
    ...unique,
    "best platform",
    "growth strategy",
  ].slice(0, 10);
};

const actionHooks = [
  "Launch smarter",
  "Win better clicks",
  "Create demand",
  "Convert attention",
  "Scale what works",
];

const buildLocalPlatformContent = (input, platform, variantIndex = 0) => {
  const { businessName, industry, productDescription, audience, goal, tone } = input;
  const phrases = tonePhrases[tone] || tonePhrases.professional;
  const goalCopy = goalLabels[goal] || goalLabels.sales;
  const angle = platformAngles[platform] || "campaign performance";
  const keywords = buildKeywords(input);
  const mainBenefit = productDescription.replace(/\.$/, "");
  const hook = actionHooks[variantIndex % actionHooks.length];
  const platformLead = {
    "Google Ads": "high-intent searches",
    Instagram: "scroll-stopping moments",
    Facebook: "warm audiences",
    LinkedIn: "B2B decision makers",
    YouTube: "video-first buyers",
  }[platform] || angle;

  const headlines = [
    `${hook} with ${businessName}`,
    `${businessName} for ${platformLead}`,
    `${phrases[0]} ${industry} growth`,
    `${goalCopy} on ${platform}`,
    `${mainBenefit.slice(0, 44)}`,
    `Turn ${angle} into revenue`,
    `${phrases[1]} campaigns, faster`,
    `Built for ${audience}`,
    `${industry} marketing that converts`,
  ];

  const descriptions = [
    `${businessName} helps ${audience} ${goalCopy} on ${platform} with ${phrases[2]} messaging and clear next steps.`,
    `${hook} around ${mainBenefit.toLowerCase()} and turn ${platformLead} into measurable action.`,
    `Reach ${audience} with ${tone} copy, stronger keywords, and conversion-focused offers.`,
    `Create sharper ads for ${industry} buyers across ${angle}, awareness, and remarketing moments.`,
  ];

  const ctas = ["Get Started", "Book a Demo", "Try It Today", "See Plans", "Start Free"]
    .slice(variantIndex % 3)
    .concat(["Get Started", "Book a Demo", "Try It Today"])
    .slice(0, 5);
  const hashtags = keywords
    .slice(0, 8)
    .map((keyword) => `#${keyword.replace(/[^a-z0-9]/g, "")}`)
    .filter((item) => item.length > 1);

  return {
    platform,
    headlines,
    descriptions,
    ctas,
    keywords,
    hashtags,
    captions: [
      `${audience} need campaigns that move quickly from interest to action. ${businessName} makes every message sharper.`,
      `Your next ${platform} campaign can be clearer, faster, and more conversion-ready with ${businessName}.`,
      `${mainBenefit}. Built for ${audience} who want fewer wasted clicks and stronger outcomes.`,
    ],
    videoScripts: [
      `Hook: Still guessing which ad copy will work? Problem: ${audience} ignore generic campaigns. Solution: ${businessName} turns ${industry} offers into ${tone} messages. CTA: ${goalCopy} today.`,
      `Open with the result, show ${mainBenefit.toLowerCase()}, highlight proof, then close with "${ctas[0]}".`,
    ],
    emailSubjects: [
      `${businessName}: a faster way to ${goalCopy}`,
      `${audience}, your next campaign is ready`,
      `New ${industry} ideas for stronger conversions`,
    ],
    landingPageCopy: [
      `Hero: ${businessName} helps ${audience} ${goalCopy}.`,
      `Subcopy: Turn ${platform} attention into action with ${tone}, keyword-rich messaging.`,
      `Proof block: Built for ${industry} teams that need practical campaigns, not blank pages.`,
    ],
    abVariations: [
      {
        name: "Benefit-led",
      headline: `${hook}: ${goalCopy} without extra complexity`,
        description: descriptions[0],
        cta: "Start Now",
      },
      {
        name: "Audience-led",
        headline: `For ${audience} ready to grow`,
        description: descriptions[2],
        cta: "Explore Campaigns",
      },
      {
        name: "Urgency-led",
      headline: `${hook} on ${platform} today`,
        description: descriptions[1],
        cta: "Generate My Ads",
      },
    ],
    optimizationSuggestions: [
      `Use "${keywords[0]}" in at least two headlines for search relevance.`,
      `Pair ${tone} copy with one direct CTA and one lower-friction CTA for A/B testing.`,
      `Match the landing page hero to the strongest ${platform} headline.`,
    ],
  };
};

const buildLocalAdCopy = (input) => {
  const seed = seedFrom(`${JSON.stringify(input)}-${input.variantSeed || ""}`);
  const platforms = input.platforms.map((platform, index) =>
    buildLocalPlatformContent(input, platform, (seed + index) % actionHooks.length),
  );

  return {
    platforms,
    analytics: {
      predictedCTR: clampScore(54 + (seed % 32)),
      engagementScore: clampScore(58 + ((seed / 3) % 34)),
      conversionScore: clampScore(50 + ((seed / 7) % 36)),
    },
  };
};

const normalizeGeneratedCopy = (input, generated = {}) => {
  const fallback = buildLocalAdCopy(input);
  const platformMap = new Map(
    fallback.platforms.map((platformContent) => [platformContent.platform, platformContent]),
  );

  const normalizedPlatforms = input.platforms.map((platform) => {
    const aiContent = (generated.platforms || []).find((item) => item.platform === platform) || {};
    const fallbackContent = platformMap.get(platform);

    return {
      platform,
      headlines: normalizeList(aiContent.headlines, fallbackContent.headlines),
      descriptions: normalizeList(aiContent.descriptions, fallbackContent.descriptions),
      ctas: normalizeList(aiContent.ctas, fallbackContent.ctas),
      keywords: normalizeList(aiContent.keywords, fallbackContent.keywords),
      hashtags: normalizeList(aiContent.hashtags, fallbackContent.hashtags),
      captions: normalizeList(aiContent.captions, fallbackContent.captions),
      videoScripts: normalizeList(aiContent.videoScripts, fallbackContent.videoScripts),
      emailSubjects: normalizeList(aiContent.emailSubjects, fallbackContent.emailSubjects),
      landingPageCopy: normalizeList(aiContent.landingPageCopy, fallbackContent.landingPageCopy),
      abVariations: Array.isArray(aiContent.abVariations) && aiContent.abVariations.length
        ? aiContent.abVariations.slice(0, 5)
        : fallbackContent.abVariations,
      optimizationSuggestions: normalizeList(
        aiContent.optimizationSuggestions,
        fallbackContent.optimizationSuggestions,
      ),
    };
  });

  return {
    platforms: normalizedPlatforms,
    analytics: {
      predictedCTR: clampScore(generated.analytics?.predictedCTR || fallback.analytics.predictedCTR),
      engagementScore: clampScore(generated.analytics?.engagementScore || fallback.analytics.engagementScore),
      conversionScore: clampScore(generated.analytics?.conversionScore || fallback.analytics.conversionScore),
    },
  };
};

const buildPrompt = (input) => `Generate high-converting ad copy as strict JSON for this campaign:
${JSON.stringify(input)}

Return this exact shape:
{
  "platforms": [
    {
      "platform": "Google Ads",
      "headlines": [],
      "descriptions": [],
      "ctas": [],
      "keywords": [],
      "hashtags": [],
      "captions": [],
      "videoScripts": [],
      "emailSubjects": [],
      "landingPageCopy": [],
      "abVariations": [{"name":"","headline":"","description":"","cta":""}],
      "optimizationSuggestions": []
    }
  ],
  "analytics": {
    "predictedCTR": 75,
    "engagementScore": 80,
    "conversionScore": 70
  }
}

Use responsive search ad style headlines, platform-specific hooks, concise descriptions, and practical keyword optimization suggestions.`;

const generateWithOpenAI = async (input) => {
  if (!process.env.OPENAI_API_KEY) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.AI_TIMEOUT_MS) || 12000);

  try {
    const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a performance marketing strategist. Return only valid JSON.",
          },
          { role: "user", content: buildPrompt(input) },
        ],
        temperature: 0.5,
        max_tokens: 1800,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return JSON.parse(stripJsonFence(data.choices?.[0]?.message?.content || ""));
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const generateWithGemini = async (input) => {
  if (!process.env.GEMINI_API_KEY) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.AI_TIMEOUT_MS) || 12000);

  try {
    const response = await fetch(`${GEMINI_GENERATE_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(input) }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 1800,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return JSON.parse(stripJsonFence(data.candidates?.[0]?.content?.parts?.[0]?.text || ""));
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const generateAdCopy = async (input) => {
  const generated = (await generateWithOpenAI(input)) || (await generateWithGemini(input));

  return normalizeGeneratedCopy(input, generated || buildLocalAdCopy(input));
};

export { buildLocalAdCopy, generateAdCopy };
