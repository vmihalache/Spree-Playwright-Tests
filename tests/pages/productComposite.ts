import { Page } from "@playwright/test"
import { ProductFactory } from "./productFactory"
import { CalculatePayment } from "./productStrategy"

interface Calculations {
    gatherCalculations(): Promise<number>
}
class CartManegement implements Calculations {
    readonly page: Page
    readonly calculation: Calculations[]
    getCheckoutTotalValue: string
    static cartResult: number[]
    static passProduct
    productToAdd: number
    constructor(page: Page) {
        this.page = page
        this.calculation = []
        this.productToAdd = 0
        this.getCheckoutTotalValue = ""
    }
    async gatherCalculations() {
        console.log(`getValue , ${this.getCheckoutTotalValue}`)
        const factory = new ProductFactory(this.page)
        const factoryResult = await factory.createProduct()
        if (factoryResult) {
            for (const product of factoryResult) {
                this.productToAdd = new CalculatePayment().
                    calculatePrice(
                        product['section.product.price.regularPrice'],
                        product['section.product.price.discountPrice'],
                        product['quantitySelectedMethod']
                    )
                this.getCheckoutTotalValue = product['getCheckoutTotalValue']
                const productCompositeHolderInstance = new ProductCompositeHolder(this.productToAdd)
                this.calculation.push(productCompositeHolderInstance)
            }
        }

        return Promise.all(this.calculation.map(child => child.gatherCalculations())).
            then((res) => {
                if (res.length > 0) {
                    return res.reduce(
                        (accumulator, currentValue) => accumulator + currentValue)
                }
            })
            .then(res => {
                if (res) {
                    this.getCheckoutTotalValue = this.getCheckoutTotalValue.replace(/[^\d.]/g, '').replace(/,/g, '');
                    const finacialResults = [Math.floor(res), parseInt(this.getCheckoutTotalValue)]
                    return finacialResults.every(el => el === finacialResults[0])
                }
            })
    }
}
class ProductCompositeHolder {
    readonly productValue: number
    constructor(productValue: number) {
        this.productValue = productValue
    }
    async gatherCalculations() {
        return Promise.resolve(this.productValue)
    }
}
export class Operation {
    readonly page: Page
    constructor(page: Page) {
        this.page = page
    }
    async operate() {
        const cartManagement = new CartManegement(this.page)
        return await cartManagement.gatherCalculations()
    }
}

