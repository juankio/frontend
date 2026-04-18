import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/product/5", { waitUntil: "networkidle0", timeout: 60000 });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("clicking button");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const addBtn = buttons.find(b => b.innerText.includes("AÑADIR A CESTA"));
    if(addBtn) addBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.includes("Tu Cesta") ? "CART OPENED" : "CART NOT OPENED");
  
  await browser.close();
})();
