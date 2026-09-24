// Posts a draft to LinkedIn through LinkedIn's own Posts API.
//
// DORMANT BY DEFAULT. It needs exactly two things:
//   LINKEDIN_TOKEN   — OAuth access token with the w_member_social and openid/profile scopes
//   LI_AUTOPOST=1    — the explicit switch, so a token alone never starts posting
//
// The member URN is NOT a secret and is NOT asked for: it is resolved from the token itself via
// /v2/userinfo on each run, so there is one less thing to copy by hand and one less thing to get wrong.
//
// Tokens last about 60 days. When one expires the post is not lost — the run reports it and the
// draft waits on the review page, so the worst case is posting by hand until a new token is in.
// Never paste a token into chat; it goes straight into GitHub secrets.
import fs from "node:fs";
import path from "node:path";

const API = "https://api.linkedin.com/rest";
const VERSION = process.env.LINKEDIN_VERSION || "202606"; // LinkedIn retires versions after about a year
const ROOT = process.cwd();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), "[li-publish]", ...a);

const token = process.env.LINKEDIN_TOKEN;
const armed = process.env.LI_AUTOPOST === "1";
let author = process.env.LINKEDIN_URN || null; // optional override; normally derived below

/** Ask LinkedIn who the token belongs to. Saves Jothi copying a member id he'd have to dig out. */
async function resolveAuthor() {
  if (author) return author;
  const r = await fetch("https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${token}` } });
  if (r.status === 401) throw new Error("TOKEN_EXPIRED");
  if (!r.ok) throw new Error(`userinfo ${r.status}: ${(await r.text()).slice(0, 140)}`);
  const me = await r.json();
  if (!me.sub) throw new Error("userinfo returned no member id — is the openid/profile scope on the token?");
  author = `urn:li:person:${me.sub}`;
  log(`posting as ${me.name || me.sub}`);
  return author;
}

const headers = () => ({
  Authorization: `Bearer ${token}`,
  "LinkedIn-Version": VERSION,
  "X-Restli-Protocol-Version": "2.0.0",
  "Content-Type": "application/json",
});

/**
 * Documents are what LinkedIn actually treats as a carousel: the viewer opens in the feed and the
 * post is measured on dwell time and saves. A multi-image post is a gallery and carries less weight.
 * Same two-step shape as an image — register, then PUT the bytes.
 */
async function uploadDocument(absPath, title) {
  const init = await fetch(`${API}/documents?action=initializeUpload`, {
    method: "POST", headers: headers(),
    body: JSON.stringify({ initializeUploadRequest: { owner: author } }),
  });
  if (!init.ok) throw new Error(`document initializeUpload ${init.status}: ${(await init.text()).slice(0, 180)}`);
  const { value } = await init.json();
  const put = await fetch(value.uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/pdf" },
    body: fs.readFileSync(absPath),
  });
  if (!put.ok) throw new Error(`document PUT ${put.status}`);
  return { id: value.document, title: title.slice(0, 100) };
}

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
  if (!token) return { skipped: "LINKEDIN_TOKEN not set" };
  // The gate: a draft the fact-check questioned, or one that makes an offer, never goes out
  // unread. Automation is worth having right up until it publishes something nobody checked.
  if (post.autopostSafe === false) {
    const why = Array.isArray(post.heldBecause) ? post.heldBecause.join("; ") : post.heldBecause;
    return { skipped: `held for review — ${why}` };
  }
  try {
    await resolveAuthor();
  } catch (e) {
    if (e.message === "TOKEN_EXPIRED") return { skipped: "LINKEDIN_TOKEN has expired — generate a new one", expired: true };
    throw e;
  }

  const images = (post.images || []).map((p) => path.join(ROOT, "public", p.replace(/^\//, "")));
  let content;
  if (post.pdf) {
    // A carousel goes up as a document. The title shows above the viewer, so it uses the hook.
    const doc = await uploadDocument(path.join(ROOT, "public", post.pdf.replace(/^\//, "")), post.hook || "Carousel");
    content = { media: doc };
    log(`uploaded carousel as a document (${images.length} pages)`);
  } else if (images.length > 1) {
    const uploaded = [];
    for (let i = 0; i < images.length; i++) uploaded.push(await uploadImage(images[i], `Slide ${i + 1}`));
    content = { multiImage: { images: uploaded } };
    log(`uploaded ${uploaded.length} images`);
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
  if (res.status === 401) return { skipped: "LINKEDIN_TOKEN has expired — generate a new one", expired: true };
  if (res.status === 426) return { skipped: `LinkedIn API version ${VERSION} is no longer active — bump VERSION in publish.mjs`, staleVersion: true };
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
  if (out.skipped) {
    log(`not posting — ${out.skipped}`);
    // Record it on the draft so the review page can say why, rather than looking silently idle.
    post.notPosted = out.skipped;
    if (out.expired) post.tokenExpired = true;
    fs.writeFileSync(file, JSON.stringify(post, null, 2) + "\n");
    process.exit(0);
  }
  post.status = "posted";
  post.postedAt = new Date().toISOString();
  post.linkedinId = out.id;
  fs.writeFileSync(file, JSON.stringify(post, null, 2) + "\n");
  log("marked as posted");
}
