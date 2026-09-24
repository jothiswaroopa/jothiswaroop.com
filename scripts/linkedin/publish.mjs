// Posts a draft to LinkedIn through LinkedIn's own Posts API.
//
// DORMANT BY DEFAULT. It does nothing unless all three are present:
//   LINKEDIN_TOKEN   — OAuth access token with the w_member_social scope
//   LINKEDIN_URN     — urn:li:person:XXXXXXXX  (your own member id)
//   LI_AUTOPOST=1    — the explicit switch, so a token alone never starts posting
//
// Getting those is a one-time job Jothi does himself at linkedin.com/developers:
// create an app, add the "Share on LinkedIn" product, run the OAuth flow, copy the token.
// Tokens last 60 days. Never paste one into chat — put it straight into GitHub secrets.
//
// This code follows LinkedIn's documented endpoints but has never run against a live account,
// because no token exists yet. Treat the first run as a test: post one draft, check the profile.
import fs from "node:fs";
import path from "node:path";

const API = "https://api.linkedin.com/rest";
const VERSION = "202405";
const ROOT = process.cwd();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), "[li-publish]", ...a);

const token = process.env.LINKEDIN_TOKEN;
const author = process.env.LINKEDIN_URN;
const armed = process.env.LI_AUTOPOST === "1";

const headers = () => ({
  Authorization: `Bearer ${token}`,
  "LinkedIn-Version": VERSION,
  "X-Restli-Protocol-Version": "2.0.0",
  "Content-Type": "application/json",
});

/** LinkedIn wants the image registered first, then the bytes PUT to the URL it hands back. */
async function uploadImage(absPath, alt) {
  const init = await fetch(`${API}/images?action=initializeUpload`, {
    method: "POST", headers: headers(),
    body: JSON.stringify({ initializeUploadRequest: { owner: author } }),
  });
  if (!init.ok) throw new Error(`initializeUpload ${init.status}: ${(await init.text()).slice(0, 180)}`);
  const { value } = await init.json();
  const put = await fetch(value.uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: fs.readFileSync(absPath),
  });
  if (!put.ok) throw new Error(`image PUT ${put.status}`);
  return { id: value.image, altText: alt };
}

export async function publish(post) {
  if (!armed) return { skipped: "LI_AUTOPOST not set" };
  if (!token || !author) return { skipped: "LINKEDIN_TOKEN or LINKEDIN_URN missing" };
  // The gate: a draft the fact-check questioned, or one that makes an offer, never goes out
  // unread. Automation is worth having right up until it publishes something nobody checked.
  if (post.autopostSafe === false) {
    const why = Array.isArray(post.heldBecause) ? `${post.heldBecause.length} open question(s)` : post.heldBecause;
    return { skipped: `held for review — ${why}` };
  }

  const images = (post.images || []).map((p) => path.join(ROOT, "public", p.replace(/^\//, "")));
  let content;
  if (images.length > 1) {
    const uploaded = [];
    for (let i = 0; i < images.length; i++) uploaded.push(await uploadImage(images[i], `Slide ${i + 1}`));
    content = { multiImage: { images: uploaded } };
    log(`uploaded ${uploaded.length} slides`);
  } else if (images.length === 1) {
    const one = await uploadImage(images[0], post.hook.slice(0, 180));
    content = { media: one };
    log("uploaded poster");
  }

  const body = {
    author,
    commentary: post.body,
    visibility: "PUBLIC",
    distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
    ...(content ? { content } : {}),
  };

  const res = await fetch(`${API}/posts`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`posts ${res.status}: ${(await res.text()).slice(0, 220)}`);
  const id = res.headers.get("x-restli-id") || "(no id returned)";
  log(`posted ${id}`);
  return { posted: true, id };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const day = process.argv[2];
  if (!day) { console.error("usage: node publish.mjs YYYY-MM-DD"); process.exit(1); }
  const file = path.join(ROOT, "content/linkedin", `${day}.json`);
  if (!fs.existsSync(file)) { console.error(`no draft for ${day}`); process.exit(1); }
  const post = JSON.parse(fs.readFileSync(file, "utf8"));
  const out = await publish(post);
  if (out.skipped) { log(`not posting — ${out.skipped}`); process.exit(0); }
  post.status = "posted";
  post.postedAt = new Date().toISOString();
  post.linkedinId = out.id;
  fs.writeFileSync(file, JSON.stringify(post, null, 2) + "\n");
  log("marked as posted");
}
