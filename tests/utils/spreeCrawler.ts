import { expect } from "@playwright/test";
import { MainPagePom } from "../pages/mainPagePom";

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
                values: string
            }
            price: {
                hasDiscount: boolean,
                regularPrice: string
                discountPrice: string
                currency: string,
            }
        }
    }
}
export class CrawlerGenerate {
    constructor() { }
    validate(combined: basicElements): boolean {
        const schemaConcreteDictionary = {
            "section.title": "string",
            "section.id": "string",
            "section.product.id": "string",
            "section.product.name": "string",
            "section.product.link": "string",
            "section.product.language": "string",
            "section.product.colourPicker.hasColourPicker": "boolean",
            "section.product.colourPicker.values": "string",
            "section.product.price.currency": "string",
            "section.product.price.regularPrice": "string",
            "section.product.price.discountPrice": "string",
            "section.product.price.hasDiscount": "boolean"
        } as const
        type SchemaMap = Record<tryGW, "string" | "number" | "boolean">;
        let valid: SchemaMap = schemaConcreteDictionary
        const isTryGW = (key: string | tryGW): key is tryGW => {
            return key as tryGW in valid
        }
        return Object.keys(combined).every(product => {
           return Object.keys(combined[product]).every(key => {
                if (!isTryGW(key)) {
                    console.log(`Unexpected key: ${key}`)
                    return false
                }
                const value = combined[product][key]
                const expected = valid[key]
                if (typeof value !== expected) {
                    console.log(`Mismatch at ${key}: expected ${expected}, got ${typeof value}`)
                    return false
                }
                return true
            })
        })
    }
}

// type PrefixForFlat = string
// type FLAT<T, PrefixForFlat> = T extends object ? FLAT<T extends "" ? T[keyof T] : "", PrefixForFlat> : T
// type Prefix = string
type GWS1C<T, Prefix extends string = ''> = T extends object ? { [K in keyof T]: GWS1C<T[K], K extends string ? `${Prefix extends "" ? K : `${Prefix}.${K}`}` : ""> }[keyof T] : Prefix
type tryGW = GWS1C<Crawler, "">
// type withoutColorPickerAndDiscount = Exclude<tryGW, | "section.product.colourPicker.hasColourPicker" | "section.product.price.hasDiscount">
// type withoutDiscount = Exclude<tryGW, | "section.product.price.hasDiscount">

type productData = Record<string, string | number | boolean>;
type basicElements = Record<string, string | number | boolean | productData>;

export const getMainPagePom = async (pageParam) => {
    const combined = await new MainPagePom(pageParam).getProductLocator()
    const crawler = new CrawlerGenerate()
    expect(crawler.validate(combined)).toBe(true);
}



