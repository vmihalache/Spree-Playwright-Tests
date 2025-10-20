import { Page } from "playwright-core";
import { getMainPagePom } from "../utils/spreeCrawler";
``
export class GetRawData {
    readonly page: Page
    constructor (page:Page) {
        this.page = page
    }
    async rawDataMethod() {
        await this.page.goto("https://demo.spreecommerce.org/?t=" + Date.now(), { waitUntil: "domcontentloaded" });
        const combined = await getMainPagePom(this.page)
        const listOfProducts = Object.values(await combined.getProductLocator())
        if (listOfProducts.length == 0) {
            this.rawDataMethod()
        }
        return listOfProducts
    }
}