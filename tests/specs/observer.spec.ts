import { Navigation } from "../utils/navigation";
import test, { expect } from "@playwright/test";
test('checkObserver', async ({ page }) => {
    const navigation = new Navigation(page)
    await navigation.goto()
    await page.waitForLoadState('networkidle'); // Wait for network to be idle
    await page.waitForTimeout(1000);
    let mutationDataType: Object | null = null;
    let mutationDataAddedNodes: number | null = null;
    let mutationDataRemovedNodes: number | null = null;
    await page.exposeFunction('notifyNodeOfMutation', async (data) => {
        // This runs in Node! Not the browser.
        console.log('Browser sent:', data);
        mutationDataType = data.mutationDataType;
        mutationDataAddedNodes = data.mutationDataAddedNodes
        mutationDataRemovedNodes = data.mutationRemovedNodes
        await page.pause()
    })
    await page.evaluate(async () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation, index) => {
                // @ts-ignore
                window.notifyNodeOfMutation({
                    mutationDataType: mutation.type,
                    mutationDataAddedNodes: Object.values(mutation.addedNodes).length,
                    mutationDataRemovedNodes : Object.values(mutation.removedNodes).length

                })
            });
        });
        const targetFrame = document.querySelector('#section-3944')
        if (targetFrame) {
            const locatorImage = targetFrame.querySelector('[data-plp-variant-picker-target="featuredImageContainer"]');
            console.log(locatorImage)
            if (locatorImage) {
                observer.observe(locatorImage, {
                    subtree: true,
                    childList: true,
                    attributes: true
                })
            }
        }
    })

    const observerTarget = page.locator('[data-plp-variant-picker-target="colorsContainer"]')
    await observerTarget.locator('[data-variant-id="1440"]').nth(0).hover()
    expect(mutationDataType).toBe('childList');
    expect(mutationDataAddedNodes).toBe(3);
    expect(mutationDataRemovedNodes).toBe(3);
})