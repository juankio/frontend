import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3001", { waitUntil: "networkidle0" });
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log("HTML length:", html.length);
  console.log("Has __nuxt-loader:", html.includes("__nuxt-loader"));
  console.log("Has Hero content:", html.includes("Eternidad"));
  await browser.close();
})();
