import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", err => console.log("PAGE ERROR:", err));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3001/product/5", { waitUntil: "networkidle0", timeout: 60000 });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const btn = await page.$("button::-p-text(Añadir a Cesta)");
  if (btn) {
    await btn.click();
    console.log("Clicked Añadir a Cesta");
  } else {
    console.log("Button not found");
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: "/home/juankio/tienda-madera/frontend/debug-cart.png" });
  
  await browser.close();
})();
