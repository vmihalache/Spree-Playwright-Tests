import test, { expect } from "@playwright/test";
import {getMainPagePom, CrawlerGenerate } from "../utils/spreeCrawler";
test('should make sure the pom methods work', async ({ page }) => {
    const crawler = new CrawlerGenerate()
    const combined = await getMainPagePom(page)
    await page.context().clearCookies()
    await page.goto("https://demo.spreecommerce.org/?t=" + Date.now(), { waitUntil: "domcontentloaded" });
    await page.waitForLoadState();
    await getMainPagePom(page)
    expect(crawler.validate(await combined.getProductLocator())).toBe(true);
})