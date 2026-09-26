const sites = [
  { name: "EdgeOne production", base: "https://sculens.leftjun.com", prefix: "" },
  { name: "Vercel mirror", base: "https://scu-lens.vercel.app", prefix: "" },
  { name: "GitHub Pages mirror", base: "https://left-jun.github.io", prefix: "/SCU-LENS" }
];

const attempts = Number(process.env.HEALTH_ATTEMPTS || 18);
const delayMs = Number(process.env.HEALTH_DELAY_MS || 10000);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function get(url) {
  const joiner = url.includes("?") ? "&" : "?";
  const response = await fetch(`${url}${joiner}health=${Date.now()}`, {
    headers: { "cache-control": "no-cache", "user-agent": "SCU-LENS-deployment-health-check" },
    redirect: "follow"
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return { response, text: await response.text() };
}

function extract(html, regex, label) {
  const match = html.match(regex);
  if (!match) throw new Error(`homepage has no ${label}`);
  return match[1];
}

async function checkSite(site) {
  const { text: html } = await get(`${site.base}${site.prefix}/`);
  if (!html.includes("SCU LENS") || !html.includes("四川大学摄影协会")) throw new Error("homepage identity markers missing");
  const cssPath = extract(html, /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/i, "stylesheet");
  const imagePath = extract(html, /<img[^>]+src=["']([^"']+)["']/i, "image");
  const resolveSameSite = (path) => path.startsWith("http") ? path : new URL(path, site.base).href;
  await get(resolveSameSite(cssPath));
  await get(resolveSameSite(imagePath));
  const { text: gallery } = await get(`${site.base}${site.prefix}/gallery`);
  if (!gallery.includes("SCU LENS")) throw new Error("gallery identity marker missing");
  if (site.prefix && (!cssPath.startsWith(site.prefix + "/") || !imagePath.startsWith(site.prefix + "/"))) {
    throw new Error(`base-path leak: css=${cssPath}, image=${imagePath}`);
  }
}

let lastErrors = [];
for (let attempt = 1; attempt <= attempts; attempt++) {
  lastErrors = [];
  for (const site of sites) {
    try {
      await checkSite(site);
      console.log(`✓ ${site.name}`);
    } catch (error) {
      lastErrors.push(`${site.name}: ${error.message}`);
      console.error(`✗ ${site.name}: ${error.message}`);
    }
  }
  if (lastErrors.length === 0) {
    console.log("All live deployment paths passed health checks.");
    process.exit(0);
  }
  if (attempt < attempts) {
    console.log(`Retrying live checks in ${delayMs / 1000}s (attempt ${attempt}/${attempts})...`);
    await sleep(delayMs);
  }
}
console.error("Live deployment health check failed:\n- " + lastErrors.join("\n- "));
process.exit(1);
