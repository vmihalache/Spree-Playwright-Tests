import { Locator, Page, test } from "@playwright/test";
export class ColourImageObserver {
    readonly page: Page
    mutationDataType: Object | null = null;
    mutationDataAddedNodes: number | null = null;
    mutationDataRemovedNodes: number | null = null;
    constructor(page: Page) {
        this.page = page
    }


    get getMutationDataType() {
        return this.mutationDataType
    }
    get getMutationDataAddedNodes() {
        return this.mutationDataAddedNodes

    }
    get getMutationDataRemovedNodes() {
        return this.mutationDataRemovedNodes
    }
    stopObserver(observer: MutationObserver) {
        observer.disconnect()
    }
    async handleMutation() {
        await this.page.waitForLoadState('networkidle'); // Wait for network to be idle
        await this.page.waitForTimeout(1000);
        await this.page.exposeFunction('notifyNodeOfMutation', async (data) => {
            // This runs in Node! Not the browser.
            console.log('Browser sent:', data);
            this.mutationDataType = data.mutationDataType;
            this.mutationDataAddedNodes = data.mutationDataAddedNodes
            this.mutationDataRemovedNodes = data.mutationDataRemovedNodes
        })
    }
    async handleObserver(sectionLocator: string) {
        await this.page.evaluate(async () => {
            window.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation, index) => {
                    // @ts-ignore
                    window.notifyNodeOfMutation({
                        mutationDataType: mutation.type,
                        mutationDataAddedNodes: Object.values(mutation.addedNodes).length,
                        mutationDataRemovedNodes: Object.values(mutation.removedNodes).length

                    })
                });
            });
            const targetFrame = document.querySelector(sectionLocator)
            if (targetFrame) {
                const locatorImage = targetFrame.querySelector('[data-plp-variant-picker-target="featuredImageContainer"]');
                console.log(locatorImage)
                if (locatorImage) {
                    window.observer.observe(locatorImage, {
                        subtree: true,
                        childList: true,
                        attributes: true
                    })
                }
            }
        })
    }
    async disconnectObserver() {
        await this.page.evaluate(() => {
            if (window.observer) {
                window.observer.disconnect()
            }
        })
    }
}

// const observerTarget = page.locator('[data-plp-variant-picker-target="colorsContainer"]')
// await observerTarget.locator('[data-variant-id="1440"]').nth(0).hover()

// expect(mutationDataType).toBe('childList');
// expect(mutationDataAddedNodes).toBe(3);
// expect(mutationDataRemovedNodes).toBe(3);
