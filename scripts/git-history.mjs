// app/sitemap.ts dates each page by the last commit that changed it, which needs the repo's history. The deploy
// build checks out a single commit (actions/checkout's default depth of 1), so fetch the rest here first.
// (fetch-depth: 0 in deploy.yml would be the obvious fix, but pushes from Jothi's Mac can't change workflow
// files: the GitHub token there has no `workflow` scope, 26 Nov 2026.)
// Locally the repo already has full history and this does nothing. It never fails the build: if the fetch
// fails, the sitemap sees a shallow clone and leaves the dates out instead of guessing.
import { execFileSync } from "node:child_process";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 120000 }).trim();
try {
  if (git("rev-parse", "--is-shallow-repository") === "true") {
    git("fetch", "--unshallow", "--no-tags", "--quiet", "origin");
    console.log(`git-history: fetched full history (${git("rev-list", "--count", "HEAD")} commits) for sitemap dates`);
  }
} catch (e) {
  console.warn(`git-history: skipped (${String(e.message).split("\n")[0]}); the sitemap will omit dates`);
}
