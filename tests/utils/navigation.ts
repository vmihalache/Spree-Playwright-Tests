import {Page} from '@playwright/test'

export class Navigation {
    readonly page: Page
    constructor(page: Page) {
        this.page = page
    }
    async goto() {
        await this.page.goto("https://demo.spreecommerce.org/")
    }
}