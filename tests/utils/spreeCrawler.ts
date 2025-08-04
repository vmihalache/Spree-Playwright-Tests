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

    detectBasicTypeElements() {}
    hasDiscountPricing() {}
    hasColorPicker() {}
    buildsType() {}
}
//generic without sales and with 1 colorPicker

type PrefixForFlat = string
type FLAT<T, PrefixForFlat> = T extends object ? FLAT<T extends "" ? T[keyof T] : "",PrefixForFlat> : T
type Prefix = string
type GWS1C<T, Prefix extends string = ''> = T extends object ? {[K in keyof T]: GWS1C<T[K],K extends string ? `${Prefix extends "" ? K  : `${Prefix}.${K}`}`:"">}[keyof T]: Prefix 
type tryGW = GWS1C<Crawler, "">
type withoutColorPickerAndDiscount = Exclude<tryGW,{hasColourPicker: "section.product.colourPicker.hasColourPicker",hasDiscount: "section.product.price.hasDiscount"}>
type withoutDiscount = Exclude<tryGW,{hasColourPicker: "section.product.colourPicker.hasColourPicker"}>
