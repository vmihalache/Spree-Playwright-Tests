import { Page } from "@playwright/test";
import { GetRawData } from "./productCollector";
import { ProductPagePom } from "./productPagePom";


type productData = {
    'section.product.id': string,
    links: string,
    sizesAvailable: [],
    hasQuantity: boolean,
    'section.product.link': string,
    'section.product.name': string,
    'section.title': string
    'section.id': string
    'section.product.language': string
    'section.product.price.currency': string
    'section.product.colourPicker.hasColourPicker': boolean,
    'section.product.colourPicker.values': string
    'section.product.price.hasDiscount': boolean,
    'section.product.price.discountPrice': string
    'section.product.price.regularPrice': string
}
interface Product {
    getProductDetails(page: Page):
        Promise<productData[]>
}
class baseProductDetails implements Product {
    async getProductDetails(page: Page): Promise<productData[]> {
        const getRawData = new GetRawData(page)
        await page.waitForLoadState() // optional safeguard
        const productPom = new ProductPagePom(page)
        const basicListProducts = await getRawData.rawDataMethod()
        // const extendedListProducts = await productPom.getProductsData(basicListProducts)
        return await productPom.getProductsData(basicListProducts)
    }
}

class ProductWithQuantityForAtleastASize extends baseProductDetails {
    async getProductWithQuantityForAtleastASize(page: Page): Promise<productData[]> {
        return baseProductDetails.getProductDetails(page)
    }
}

class ProductWithoutAnySizes extends baseProductDetails {
    async getProductWithQuantityForAtleastASize(page: Page): Promise<productData[]> {
        return this.getProductDetails(page)
    }
}

class ProductFactory {
    readonly page: Page
    constructor(page: Page) {
        this.page = page
    }
    async createProduct() {
        const getProductData = new baseProductDetails()
        const getResult = await getProductData.getProductDetails(this.page)
        for (const element of getResult) {
            if (element["hasQuantity"] === true) {
                if (element["sizesAvailable"].length > 0) {
                    return ProductWithQuantityForAtleastASize.
                }
            }
            else {
                return getResult
            }
        }
    }
}
