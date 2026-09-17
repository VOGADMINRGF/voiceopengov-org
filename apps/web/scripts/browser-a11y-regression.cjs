const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;

const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000";
const failures = [];
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

function fail(message) {
  failures.push(message);
}

function summarizeViolations(path, violations) {
  return violations.map((violation) => {
    const nodes = violation.nodes
      .slice(0, 4)
      .map((node) => `${node.target.join(" ")} :: ${node.failureSummary || node.html}`)
      .join(" | ");
    return `${path}: [${violation.impact || "unknown"}] ${violation.id} — ${violation.help}${nodes ? ` — ${nodes}` : ""}`;
  });
}

async function openPage(context, path) {
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  if (!response || !response.ok()) fail(`${path}: HTTP ${response?.status() ?? "no response"}`);
  await page.waitForTimeout(250);
  if (runtimeErrors.length) fail(`${path}: runtime errors: ${runtimeErrors.join(" | ")}`);
  return page;
}

async function checkPage(context, path) {
  const page = await openPage(context, path);

  const h1Count = await page.locator("h1").count();
  if (h1Count !== 1) fail(`${path}: expected exactly one h1, found ${h1Count}`);

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  if (hasOverflow) fail(`${path}: horizontal overflow`);

  const lang = await page.locator("html").getAttribute("lang");
  const dir = await page.locator("html").getAttribute("dir");
  if (!lang) fail(`${path}: missing html lang`);
  if (!dir) fail(`${path}: missing html dir`);

  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  for (const violation of summarizeViolations(path, results.violations)) fail(violation);

  await page.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    for (const path of [
      "/",
      "/mitmachen",
      "/fragen",
      "/transparenz",
      "/unterstuetzen",
      "/regionen/deutschland/berlin",
    ]) {
      await checkPage(desktop, path);
    }

    const skipPage = await openPage(desktop, "/");
    const skip = skipPage.locator('a[href="#main-content"]');
    if ((await skip.count()) !== 1) {
      fail("/: skip-to-content link missing or duplicated");
    } else {
      await skip.focus();
      const focused = await skip.evaluate((element) => document.activeElement === element);
      if (!focused) fail("/: skip-to-content link cannot receive keyboard focus");
      const box = await skip.boundingBox();
      if (!box || box.y < -1) fail("/: focused skip-to-content link remains off-screen");
      await skipPage.keyboard.press("Enter");
      await skipPage.waitForTimeout(100);
      const landed = await skipPage.evaluate(
        () => location.hash === "#main-content" || document.activeElement?.id === "main-content",
      );
      if (!landed) fail("/: skip-to-content link does not land on main content");
    }
    await skipPage.close();
    await desktop.close();

    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      screen: { width: 390, height: 844 },
      hasTouch: true,
      reducedMotion: "reduce",
    });
    for (const path of ["/", "/mitmachen", "/fragen", "/regionen/deutschland/berlin"]) {
      await checkPage(mobile, path);
    }
    await mobile.close();

    const narrow = await browser.newContext({
      viewport: { width: 320, height: 700 },
      screen: { width: 320, height: 700 },
      hasTouch: true,
      reducedMotion: "reduce",
    });
    for (const path of ["/", "/mitmachen"]) {
      await checkPage(narrow, path);
    }
    await narrow.close();

    const rtl = await browser.newContext({
      viewport: { width: 390, height: 844 },
      locale: "ar",
      hasTouch: true,
      reducedMotion: "reduce",
    });
    const rtlPage = await openPage(rtl, "/?lang=ar");
    const rtlLang = await rtlPage.locator("html").getAttribute("lang");
    const rtlDir = await rtlPage.locator("html").getAttribute("dir");
    if (rtlLang !== "ar") fail(`/?lang=ar: expected html lang=ar, found ${rtlLang}`);
    if (rtlDir !== "rtl") fail(`/?lang=ar: expected html dir=rtl, found ${rtlDir}`);
    const rtlResults = await new AxeBuilder({ page: rtlPage }).withTags(tags).analyze();
    for (const violation of summarizeViolations("/?lang=ar", rtlResults.violations)) fail(violation);
    await rtlPage.close();
    await rtl.close();
  } finally {
    await browser.close();
  }

  if (failures.length) {
    console.error("Public browser accessibility regression failed:\n");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log(
    "Public browser accessibility regression passed: WCAG 2.x/2.2 AA automated checks, one-h1 structure, lang/dir, skip link, overflow, desktop, mobile and RTL.",
  );
}

main().catch((error) => {
  console.error("Public browser accessibility regression crashed:", error);
  process.exitCode = 1;
});
