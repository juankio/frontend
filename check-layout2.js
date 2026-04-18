import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3001/product/5", { waitUntil: "networkidle0", timeout: 60000 });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const layout = await page.evaluate(() => {
    const left = document.querySelector(".w-full.md\\:w-1\\/2.flex.flex-col");
    const right = document.querySelector(".w-full.md\\:w-1\\/2.h-\\[60vh\\]");
    return {
      left: left ? left.getBoundingClientRect().toJSON() : "Not found left",
      right: right ? right.getBoundingClientRect().toJSON() : "Not found right"
    };
  });
  console.log(JSON.stringify(layout, null, 2));
  
  await browser.close();
})();
