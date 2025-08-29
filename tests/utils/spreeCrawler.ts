import { expect } from "@playwright/test";

type Crawler = {
    section: {
        title: string,
        id: string;
        product: {
            name: string,
            id: number,
            link: string,
            language: string
            colourPicker: {
                hasColourPicker: boolean
            }
            price: {
                hasDiscount: boolean,
                currency: string,
            }
        }
    }
}
class CrawlerGenerate {
    constructor() { }
    detectBasicTypeElements() {
        return {
            "section.title": "string",
            "section.id": "string",
            "section.product.id": "string",
            "section.product.name": "string",
            "section.product.link": "string",
            "section.product.language": "string",
        }
    }

    hasDiscountPricing() {
        return { "section.product.price.currency": "string" }
    }
    hasColorPicker() {
        return {
            "section.product.colourPicker.hasColourPicker": "boolean"
        }
    }

    buildsType() {
        return Object.assign({}, this.detectBasicTypeElements(), this.hasColorPicker(), this.hasDiscountPricing())
    }
    validate(combined: basicElements): boolean {
        const valid = this.buildsType();
        console.log(JSON.stringify(valid))
        return Object.keys(combined).every(key => {
            key in valid && typeof combined[key] === valid[key];
        })
    }
}

type PrefixForFlat = string
type FLAT<T, PrefixForFlat> = T extends object ? FLAT<T extends "" ? T[keyof T] : "", PrefixForFlat> : T
type Prefix = string
type GWS1C<T, Prefix extends string = ''> = T extends object ? { [K in keyof T]: GWS1C<T[K], K extends string ? `${Prefix extends "" ? K : `${Prefix}.${K}`}` : ""> }[keyof T] : Prefix
type tryGW = GWS1C<Crawler, "">
type withoutColorPickerAndDiscount = Exclude<tryGW, | "section.product.colourPicker.hasColourPicker" | "section.product.price.hasDiscount">
type withoutDiscount = Exclude<tryGW, | "section.product.price.hasDiscount">

type productData = Record<string, string | number | boolean>;
type basicElements = Record<string, string | number | boolean | productData>;

const combined: basicElements = {
    "section.title": "New Arrivals",
    "section.id": "section-3944",
    productIdPlaceHolder: {
        "section.product.id": "product-259",
        "section.product.name": "Checkered Shirt",
        "section.product.link": "/products/checkered-shirt",
        "section.product.language": "EN",
        "section.product.colourPicker.hasColourPicker": true,
        "section.product.price.currency": "USD"
    }
}
const { "section.title": sectionTitle,
    "section.id": sectionId, ...partialObject } = combined as {
        "section.title": string,
        "section.id": string,
    };

Object.keys(partialObject).map(val => {
    const subsetProductSection = { "section.title": sectionTitle, ...partialObject[val], 'section.id': sectionId }
    const crawler = new CrawlerGenerate()
    expect(crawler.validate(subsetProductSection)).toBe(true);
})





