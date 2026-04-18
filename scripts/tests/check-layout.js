import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3001/product/2", { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: "/home/juankio/tienda-madera/frontend/debug-desktop.png", fullPage: true });
  await browser.close();
})();
