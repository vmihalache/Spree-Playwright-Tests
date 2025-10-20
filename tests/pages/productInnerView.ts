import { Locator, Page } from "playwright-core"

export class ProductInnerView {
    readonly page: Page
    readonly sizeDropDown: Locator
    readonly sizeAvailability: Locator
    readonly quantityIncrease: Locator
    readonly quantityValue: Locator
    readonly addToCartButton: Locator
    constructor(page: Page) {
        this.page = page
        this.sizeDropDown = this.page.locator('button[data-dropdown-target="button"]')
        this.sizeAvailability = this.page.locator('[data-dropdown-target="menu"]').locator("label")
        this.quantityIncrease = this.page.locator('button[data-quantity-picker-target="increase"]')
        this.quantityValue = this.page.locator('input[data-quantity-picker-target="quantity"]')
        this.addToCartButton = this.page.locator('button[data-product-form-target="submit"]')
    }

    async getSizeAvailability() {
        try {
            const isDropdownVisible = await this.sizeDropDown.isVisible({ timeout: 3000 });
            if (!isDropdownVisible) {
                console.log("Dropdown not visible");
                return this.getEmptyResult();
            }
            console.log("Dropdown is visible, proceeding to get sizes.");
            await this.sizeDropDown.click(); // No force needed, as we waited for it.
            const availableSizes = await this.sizeAvailability
                .filter({ hasNot: this.page.locator(".cursor-not-allowed") })
                .all();
            if (availableSizes.length > 0) {
                // console.log("Returning with available sizes.");
                return {
                    sizes: await Promise.all(availableSizes.map(el => el.innerText())),
                    hasQuantity: true
                };
            }
            return this.getEmptyResult();
        }
        catch (error) {

            // console.log("No size dropdown found. This product may not have size options.");
            return this.getEmptyResult();
        }
    }
    private async getEmptyResult() {
        if (await this.quantityIncrease.isEnabled()) {
            return { sizes: [], hasQuantity: true };
        }
        return { sizes: [], hasQuantity: false };
    }
}
// const size = allSizes[Math.floor(Math.random() * allSizes.length)];
// await size.click()
// if (await this.addToCartButton.getByText('Please choose Size').isVisible())
// async increaseQuantity() {
//     const randomNumberOfProducts = Math.floor(Math.random() * 10)
//     for (let randomBaseNumber = 0; randomBaseNumber < randomNumberOfProducts; randomBaseNumber++) {
//         await this.quantityIncrease.click()
//     }
// }
// async addToCart() {
//     await this.addToCartButton.click()
//sizesAvailable: ["S","M"]
//hasQuantity: true/false
