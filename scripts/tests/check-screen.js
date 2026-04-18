import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", err => console.log("PAGE ERROR:", err));
  await page.goto("http://localhost:3001", { waitUntil: "networkidle0", timeout: 60000 });
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log("HTML contains __nuxt-loader:", html.includes("__nuxt-loader"));
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
})();
