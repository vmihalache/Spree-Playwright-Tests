import { Page } from "@playwright/test";
import { ProductInnerView } from "./productInnerView";

export class ProductPagePom {
    readonly page: Page
    constructor(page: Page) {
        this.page = page
    }
    async getProductsData(listOfProducts) {
        const productChangedArray: any[] = []
        const numberOfProductsToCheck = Math.floor(Math.random() * listOfProducts.length)
        const productInnerView = new ProductInnerView(this.page)
        for (let i = 0; i < numberOfProductsToCheck; i++) {
            await this.page.goto(`https://demo.spreecommerce.org${listOfProducts[i]['section.product.link']}`, { waitUntil: "networkidle" })
            if (listOfProducts[i]) {
                await productInnerView.drawerManagement()
                const sizeData = await productInnerView.getSizeAvailability();
                productChangedArray.push({
                    "section.product.id": listOfProducts[i]['section.product.id'],
                    "links": `https://demo.spreecommerce.org${listOfProducts[i]['section.product.link']}`,
                    "sizesAvailable": sizeData.sizesAvailable,
                    "hasQuantity": sizeData.hasQuantity,
                })
                const productRecord = productChangedArray[i];
                productChangedArray.forEach(productObject => {
                    if (productObject['section.product.id'] == listOfProducts[i]['section.product.id']) {
                        productObject = Object.assign(productChangedArray[i], listOfProducts[i])
                    }
                })
                const actionsObject = productInnerView.actions as any;
                for (const action of Object.keys(actionsObject)) {
                    if (typeof actionsObject[action] === 'function') {
                        const actionResult = await actionsObject[action]();
                        if (actionResult !== undefined && actionResult !== null) {
                            productRecord[action] = actionResult
                        }
                    }
                }
            }
        }
        return productChangedArray
    }
}





