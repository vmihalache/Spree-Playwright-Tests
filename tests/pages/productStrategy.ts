import { Scenario } from "./productBuilder";

interface Payment {
    calculatePrice(hasbasicPrice: string, hasDiscountPrice: string, hasItemsToBuy: string): number
}
export class CalculatePayment implements Payment {
    constructor() { }
    calculatePrice(basicPrice: string, discountPrice: string, hasItemsToBuy: string): number {
        const basicData = new Scenario()
            .hasbasicPrice(basicPrice)
            .hasDiscountPrice(discountPrice)
            .calculate();
        if (Number(basicData[1]) === 0) {
            return Number(basicData[0]) * (Number(hasItemsToBuy))
        }
        return Math.round((Number(basicData[1]) * (Number(hasItemsToBuy))))* 100/100
    }

}