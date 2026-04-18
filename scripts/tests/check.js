import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", err => console.error("PAGE ERROR:", err));
  await page.goto("http://localhost:3001", { waitUntil: "networkidle0" });
  await browser.close();
})();
