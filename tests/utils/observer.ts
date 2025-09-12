import {Page} from "@playwright/test";
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
        await this.page.waitForLoadState('networkidle'); 
        await this.page.waitForTimeout(1000);
        await this.page.exposeFunction('notifyNodeOfMutation', async (data) => {
            console.log('Browser sent:', data);
            this.mutationDataType = data.mutationDataType;
            this.mutationDataAddedNodes = data.mutationDataAddedNodes
            this.mutationDataRemovedNodes = data.mutationDataRemovedNodes
        })
    }
    async handleObserver(sectionLocator: string) {
        await this.page.evaluate((sectionLocator) => {
            window.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation, index) => {
                    // @ts-ignore
                    window.notifyNodeOfMutation({
                        mutationDataType: mutation.type,
                        mutationDataAddedNodes: mutation.addedNodes.length,
                        mutationDataRemovedNodes: mutation.removedNodes.length

                    })
                });
            });
            if (sectionLocator) {
                const targetFrame = document.querySelector(sectionLocator)
                if (targetFrame) {
                    const locatorImage = targetFrame.querySelector('[data-plp-variant-picker-target="featuredImageContainer"]');
                    if (locatorImage) {
                        window.observer.observe(locatorImage, {
                            subtree: true,
                            childList: true,
                            attributes: true
                        })

                        console.log('✅ Observer started on element'); // Debug
                    } else {
                        console.log('❌ Image container not found');
                    }
                } else {
                    console.log('❌ Target frame not found');
                }
            }

        }, sectionLocator)
    }
    async disconnectObserver() {
        await this.page.evaluate(() => {
            if (window.observer) {
                window.observer.disconnect()
            }
        })
    }
}

