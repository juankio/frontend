import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-gl=swiftshader"] });
  const page = await browser.newPage();
  page.on("console", msg => console.log("BROWSER LOG:", msg.type(), msg.text()));
  page.on("pageerror", err => console.log("BROWSER ERROR:", err));
  await page.goto("http://localhost:3001/product/6", { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise(r => setTimeout(r, 8000));
  await browser.close();
})();
