// A second pass that reads the finished draft as a sceptical fact-checker.
//
// The rule-based validator catches numbers that are not in the approved receipts. It cannot catch a
// sentence like "we kept tracing bad leads back to the same six places" — a claim about Jothi's own
// experience that sounds true and may not be. This pass looks for exactly that: anything asserted as
// fact, as his experience, or as how a platform behaves, that nothing given to the model supports.
//
// Blocking findings force a rewrite. "Check" findings are shown on the review page before he posts.
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, "config.json"), "utf8"));
const client = new Anthropic();

const TOOL = {
  name: "report_findings",
  description: "Report every claim in the draft that the supplied material does not support.",
  input_schema: {
    type: "object",
    properties: {
      findings: {
        type: "array",
        description: "One entry per unsupported claim. Empty if everything checks out.",
        items: {
          type: "object",
          properties: {
            quote: { type: "string", description: "The exact words from the draft." },
            issue: { type: "string", description: "Why it is not supported, in one sentence." },
            severity: {
              type: "string",
              enum: ["blocking", "check"],
              description: "blocking = states a figure, a client outcome, or a first-hand experience nothing supports. check = an interpretation or generalisation a reasonable expert might defend.",
            },
          },
          required: ["quote", "issue", "severity"],
        },
      },
    },
    required: ["findings"],
  },
};

export async function verify(post, sources = null) {
  const material = [
    "APPROVED FACTS — the only things known to be true about Jothi Swaroop's work:",
    ...cfg.approvedFacts.map((f) => `- ${f}`),
    "",
    `CLIENTS THAT MAY BE NAMED: ${cfg.namedPublicly.join(", ")}`,
    sources?.length
      ? "\nNEWS THE POST MAY DRAW ON:\n" + sources.map((s) => `- [${s.publisher}] ${s.title} — ${s.url}`).join("\n")
      : "",
  ].join("\n");

  const draft = [post.body, ...(post.slides || []).map((s) => s.text)].join("\n");

  const res = await client.messages.create({
    model: cfg.model,
    max_tokens: 2000,
    tools: [TOOL],
    tool_choice: { type: "tool", name: "report_findings" },
    messages: [{
      role: "user",
      content: `You are fact-checking a LinkedIn post before it goes out under a real person's name. His whole positioning is that every number he publishes has a receipt behind it, so a single invented claim is expensive.

${material}

DRAFT:
"""
${draft}
"""

Flag every claim that the material above does not support. In particular:
- Any figure, percentage or quantity that is not in the approved facts word for word.
- Any claim about what HE did, saw, found or was told — "I noticed", "we kept finding", "in my experience", "every client I work with" — that the approved facts do not establish.
- Any claim about a client's results or behaviour.
- Any statement about how a platform works presented as certain fact, where it is actually a generalisation.
- Any named framework or method presented as established or widely used when it is simply his own idea.

Do NOT flag: general advice, opinions clearly framed as opinion, hypotheticals openly marked as hypothetical ("say a clinic runs..."), or well-known platform mechanics that any practitioner would confirm.

Be strict about the first-hand-experience ones. Those are the claims that read as most credible and are easiest to invent.`,
    }],
  });

  const call = res.content.find((c) => c.type === "tool_use");
  const findings = call?.input?.findings ?? [];
  return {
    blocking: findings.filter((f) => f.severity === "blocking"),
    check: findings.filter((f) => f.severity === "check"),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const day = process.argv[2];
  const file = path.join(process.cwd(), "content/linkedin", `${day}.json`);
  const post = JSON.parse(fs.readFileSync(file, "utf8"));
  const out = await verify(post, post.sources);
  console.log(`blocking: ${out.blocking.length} · check: ${out.check.length}\n`);
  for (const f of [...out.blocking, ...out.check]) {
    console.log(`[${f.severity}] "${f.quote.slice(0, 90)}"\n    ${f.issue}\n`);
  }
}
