import test, { expect } from "@playwright/test";
import { MainPagePom } from "../pages/mainPagePom";
import {getMainPagePom, CrawlerGenerate } from "../utils/spreeCrawler";
test('should make sure the pom methods work', async ({ page }) => {
    const crawler = new CrawlerGenerate()
    const combined = await getMainPagePom(page)
    await page.context().clearCookies()
    const mainPagePom = new MainPagePom(page)
    await mainPagePom.openUrl()
    await page.goto("https://demo.spreecommerce.org/?t=" + Date.now(), { waitUntil: "domcontentloaded" });
    await page.waitForLoadState();
    await getMainPagePom(page)
    expect(crawler.validate(await combined.getProductLocator())).toBe(true);
})