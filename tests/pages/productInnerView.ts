import { Locator, Page } from "playwright-core"
export class ProductInnerView {
    readonly page: Page
    readonly sizeDropDown: Locator
    readonly quantitySelector: Locator
    readonly inputLocator: Locator
    quantitySelected: Number
    readonly quantityIncrease: Locator
    readonly quantityValue: Locator
    readonly addToCartButton: Locator
    readonly cartPaneTotalValue: Locator
    readonly checkoutButton: Locator
    readonly checkoutTotalValue: Locator
    readonly productImage: Locator
    cachedSizes: Locator[]
    getSizes: Locator[]
    static lastTotalValue: any
    constructor(page: Page) {
        this.page = page
        this.sizeDropDown = this.page.locator('button[data-dropdown-target="button"]')
        this.inputLocator = this.page.locator('[data-dropdown-target="menu"]')
        this.quantitySelector = this.page.locator('[data-editor-name="Quantity Selector"]').getByText(/Only \d+ left/);
        this.quantityIncrease = this.page.locator('button[data-quantity-picker-target="increase"]')
        this.quantityValue = this.page.locator('input[data-quantity-picker-target="quantity"]')
        this.addToCartButton = this.page.locator('button[data-product-form-target="submit"]')
        this.cartPaneTotalValue = this.page.locator('[data-controller="cart"]').getByText(" Total ").locator('span')
        this.checkoutButton = this.page.locator('[data-cart-target="checkoutButton"]')
        this.checkoutTotalValue = this.page.locator('[data-hook="order_summary"]').locator('span').nth(1)
        this.productImage = this.page.locator(
            '[data-pdp-desktop-gallery-target="imagesSlider"] img'
        ).first();
        this.getSizes = []
        this.cachedSizes = []
        this.quantitySelected = 0
    }
    async drawerManagement() {
        try {
            const isDropdownVisible = await this.sizeDropDown.isVisible({ timeout: 3000 });
            if (!isDropdownVisible) {
                return this.getEmptyResult();
            }
            else {
                await this.sizeDropDown.click(); 
                for (const inpu of await this.inputLocator.all()) {
                    this.cachedSizes = await inpu.locator("input:not(:checked) + label:not(.cursor-not-allowed)").all()
                }
            }
        }
        catch (error) {
            return this.getEmptyResult();
        }
    }

    async getSizeAvailability() {
        const sizes = this.cachedSizes
        if (Array.isArray(sizes)) {
            if (sizes.length > 0) {
                return {
                    sizesAvailable: await Promise.all(sizes.map(el => el.innerText())),
                    hasQuantity: true
                };
            }
            return this.getEmptyResult();
        }
    }
    private async getEmptyResult() {
        if (await this.quantityIncrease.isEnabled()) {
            this.cachedSizes = []
            return { sizesAvailable: [], hasQuantity: true };
        }
        return { sizesAvailable: [], hasQuantity: false };
    }

    async increaseQuantity() {
        await this.quantityIncrease.waitFor({ state: 'visible' });
        let randomNumberOfProductsValue = Math.floor(Math.random() * 10) + 1
        let randomBaseNumber = 1
        if (await this.quantitySelector.isVisible()) {
            const val = await this.quantitySelector.textContent()
            if (val) {
                randomBaseNumber = parseInt(val)
            }
        }
        for (randomBaseNumber; randomBaseNumber < randomNumberOfProductsValue; randomBaseNumber++) {
            if (await this.quantityIncrease.isEnabled()) {
                await this.quantityIncrease.click()
            }
        }
        this.quantitySelected = randomBaseNumber
    }
    async addToCart() {
        const addToCartButton = await this.addToCartButton.all()
        await addToCartButton[0].click()
        await this.page.waitForTimeout(2000);
    }
    async getCartPaneTotalValue() {
        const cartContainer = this.page.locator('.cart-summary-container');
        await cartContainer.waitFor({ state: 'visible', timeout: 200000 });
        const locator = this.cartPaneTotalValue;
        await this.page.waitForTimeout(1000);
        const updated = (await locator.textContent())?.trim();
        return updated;
    }
    async checkOutClick() {
        this.checkoutButton.click()
    }
    async getCheckoutTotalValue() {
        const cartPaneLocator = this.checkoutTotalValue
        await cartPaneLocator.waitFor({ state: 'visible' });
        return cartPaneLocator.textContent()
    }
    async pickASize() {
        const sizes = this.cachedSizes
        if (Array.isArray(sizes)) {
            if (sizes.length > 0) {
                const randomLocator = sizes[Math.floor(Math.random() * sizes.length)];
                await randomLocator.click();
            }
            else {
                await this.getEmptyResult()
            }
        }

    }
    get quantitySelectedMethod() {
        return this.quantitySelected
    }
    get actions() {
        return {
            pickASize: async () => this.pickASize(),
            increaseQuantity: async () => this.increaseQuantity(),
            addToCart: async () => this.addToCart(),
            getCartPaneTotalValue: async () => this.getCartPaneTotalValue(),
            checkOutClick: async () => this.checkOutClick(),
            getCheckoutTotalValue: async () => this.getCheckoutTotalValue(),
            quantitySelectedMethod: async () => this.quantitySelectedMethod
        }
    }
}
