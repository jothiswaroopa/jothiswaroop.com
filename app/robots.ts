import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // Named explicitly so no future default-deny or CDN rule quietly cuts us out of AI answers.
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot", "meta-externalagent", "Amazonbot", "Bytespider", "DuckAssistBot"], allow: "/" },
    ],
    sitemap: "https://jothiswaroop.com/sitemap.xml",
    host: "https://jothiswaroop.com",
  };
}
