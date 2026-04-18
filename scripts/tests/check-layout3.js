import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3001/product/5", { waitUntil: "networkidle0", timeout: 60000 });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const containerInfo = await page.evaluate(() => {
    const container = document.querySelector(".flex.flex-col.md\\:flex-row.min-h-\\[calc\\(100vh-7rem\\)\\]");
    if (!container) return null;
    return {
      classes: container.className,
      rect: container.getBoundingClientRect().toJSON(),
      flexDir: window.getComputedStyle(container).flexDirection,
      children: Array.from(container.children).map(c => ({
        tag: c.tagName,
        classes: c.className,
        rect: c.getBoundingClientRect().toJSON(),
        x: window.getComputedStyle(c).transform
      }))
    };
  });
  console.log(JSON.stringify(containerInfo, null, 2));
  
  await browser.close();
})();
