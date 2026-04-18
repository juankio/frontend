import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3001/product/5", { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  
  const info = await page.evaluate(() => {
    // Find the min-h-[calc...] container
    const divs = Array.from(document.querySelectorAll("div"));
    const container = divs.find(d => d.className.includes("min-h-[calc(100vh-7rem)]"));
    if (!container) return { error: "Container not found" };
    
    const children = Array.from(container.children);
    return {
      container: { 
        classes: container.className, 
        rect: container.getBoundingClientRect().toJSON(),
        flexDirection: window.getComputedStyle(container).flexDirection 
      },
      child0: { 
        classes: children[0].className,
        rect: children[0].getBoundingClientRect().toJSON(),
        order: window.getComputedStyle(children[0]).order
      },
      child1: { 
        classes: children[1].className,
        rect: children[1].getBoundingClientRect().toJSON(),
        order: window.getComputedStyle(children[1]).order
      }
    };
  });
  console.log(JSON.stringify(info, null, 2));
  
  await browser.close();
})();
