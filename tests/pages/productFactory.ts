import { Page } from "@playwright/test";
import { GetRawData } from "./productCollector";
import { ProductPagePom } from "./productPagePom";


export type productData = {
    'section.product.id': string,
    links: string,
    sizesAvailable: [],
    hasQuantity: boolean,
    requiresSizeSelection: boolean,
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
    'quantitySelectedMethod': string
    'getCartPaneTotalValue': string
    'getCheckoutTotalValue': string
    'actions': {
        getCartPaneTotalValue: () => Promise<number>
        checkOutClick: () => Promise<void>
        getCheckoutTotalValue: () => Promise<number>
        pickASize: () => Promise<void>
        getContext: () => Promise<any>
    }
}
interface Product {
    getProductDetails(page: Page):
        Promise<productData[]>
}
class baseProductDetails implements Product {
    async getProductDetails(page: Page): Promise<productData[]> {
        const getRawData = new GetRawData(page)
        await page.waitForLoadState() 
        const productPom = new ProductPagePom(page)
        const basicListProducts = await getRawData.rawDataMethod()
        const extendedListProducts = await productPom.getProductsData(basicListProducts)
        return extendedListProducts
    }
    protected filterProducts(products: productData[], requiresSize: boolean): productData[] {
        return products.filter(product => {
            const hasSize = product["sizesAvailable"].length > 0;
            const hasQuantity = product["hasQuantity"] === true;

            if (requiresSize) {
                return hasQuantity && hasSize; 
            } else {
                return !hasSize && hasQuantity       
            }
        });
    }
}

class ProductWithQuantityForAtleastASize extends baseProductDetails {
    async getProductWithQuantityForAtleastASize(page: Page): Promise<productData[]> {
        return this.getProductDetails(page)
    }
    static async getResult(fullAugmentedList: productData[]): Promise<productData[]> {
        const instance = new ProductWithQuantityForAtleastASize();
        return instance.filterProducts(fullAugmentedList, true); 
    }
}

class ProductWithoutAnySizes extends baseProductDetails {
    async getProductWithoutAnySizes(page: Page): Promise<productData[]> {
        return this.getProductDetails(page)
    }
    static async getResult(fullAugmentedList: productData[]): Promise<productData[]> {
        const instance = new ProductWithoutAnySizes();
        return instance.filterProducts(fullAugmentedList, false); 
    }
}

export class ProductFactory {
    readonly page: Page
    constructor(page: Page) {
        this.page = page
    }
    async createProduct() {
        const getProductData = new baseProductDetails()
        const allAugmentedProducts = await getProductData.getProductDetails(this.page)
        const productsWithSize = await ProductWithQuantityForAtleastASize.getResult(allAugmentedProducts);
        const productsWithoutSizes = await ProductWithoutAnySizes.getResult(allAugmentedProducts);

        const validProducts = [...productsWithSize, ...productsWithoutSizes];
        return validProducts;
    }
}

