require("module").Module._initPaths();

const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = {};

  for (const item of [
    { name: "desktop", width: 1440, height: 1200 },
    { name: "mobile", width: 390, height: 860 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: item.width, height: item.height },
      deviceScaleFactor: 1,
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(
      "file:///C:/Users/Dell/OneDrive/Documents/Playground/scoutai-landing-page/index.html"
    );
    await page.waitForLoadState("load");
    await page.waitForTimeout(600);

    const title = await page.title();
    const h1 = await page.locator("h1").textContent();
    await page.screenshot({
      path: `C:/Users/Dell/OneDrive/Documents/Playground/scoutai-landing-page/verification-${item.name}.png`,
      fullPage: false,
    });
    const copy = page.locator(".copy-code");
    await copy.click();
    await page.waitForTimeout(100);
    const copyText = await copy.textContent();
    const overflow = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll("body *").forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (
          rect.width > window.innerWidth + 2 &&
          getComputedStyle(element).position !== "fixed"
        ) {
          bad.push({
            tag: element.tagName,
            cls: String(element.className),
            width: rect.width,
          });
        }
      });
      return bad.slice(0, 8);
    });

    results[item.name] = { title, h1, copyText, errors, overflow };
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
