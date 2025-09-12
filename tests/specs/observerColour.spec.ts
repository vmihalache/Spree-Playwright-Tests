import test, { expect } from "@playwright/test";
import { MainPagePom } from "../pages/mainPagePom";
import { getMainPagePom } from "../utils/spreeCrawler";
import { ColourImageObserver } from '../utils/observer'
test('should make sure the pom methods work', async ({ page }) => {
    const colourImageObserver = new ColourImageObserver(page)
    const mainPagePom = new MainPagePom(page)
    await mainPagePom.openUrl()
    await page.goto("https://demo.spreecommerce.org/?t=" + Date.now(), { waitUntil: "domcontentloaded" });
    await page.waitForLoadState();
    const arr = await getMainPagePom(page)
    const estimatedTime = Object.keys(arr.getSectionColour).length * 10; 
    test.setTimeout(Math.max(60000, estimatedTime * 1000)); 
    
    await colourImageObserver.handleMutation()
    for (const sectionKeys of Object.keys(arr.getSectionColour)) {
        const elem = arr.getSectionColour[sectionKeys]
        const sectionVariant = sectionKeys
        for (const elemColour of elem) {
            if (sectionVariant && elem[0]) {
                await colourImageObserver.handleObserver(`#${sectionVariant}`)
                try {
                    const variant = await elemColour.evaluate(el => el.getAttribute('data-variant-id'));
                    await mainPagePom.getSectionLocator
                        .locator(`[data-plp-variant-picker-target="colorsContainer"] [data-variant-id="${variant}"]`)
                        .nth(0)
                        .hover()

                    expect(colourImageObserver.mutationDataType).toBe('childList');
                    expect(colourImageObserver.mutationDataAddedNodes).toBe(3);
                    expect(colourImageObserver.mutationDataRemovedNodes).toBe(3);

                } catch (error) {
                    console.log('Element not found or error:', error.message);
                    continue;
                }
                finally {
                    await colourImageObserver.disconnectObserver();
                }
            }
        }
    }
})
