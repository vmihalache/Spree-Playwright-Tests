import { Locator, Page } from "@playwright/test";

export class MainPagePom {
    readonly page: Page
    readonly sectionLocator: Locator
    readonly sectionTitle: Locator
    readonly productPrice: Locator
    readonly productTitle: Locator
    readonly colourPicker: Locator
    readonly currency: Locator
    readonly language: Locator
    readonly hasDiscount: Locator
    readonly regularPrice: Locator
    readonly discountPrice: Locator
    readonly observerTarget: Locator
    sectionColour: {}
    constructor(page: Page) {
        this.page = page
        this.sectionLocator = this.sectionLocator = this.page.locator('turbo-frame[id^="section-"]')
        this.sectionTitle = this.page.locator('data-title')
        this.language = this.page.locator('button[data-action="modal#open"]').locator('span').last()
        this.currency = this.page.locator('button[data-action="modal#open"]').locator('span').first()
        this.colourPicker = this.page.locator('[data-plp-variant-picker-target="colorsContainer"]')
        this.regularPrice = this.page.locator('[data-plp-variant-picker-target="priceContainer"]').locator('p').first()
        this.discountPrice = this.page.locator('[data-plp-variant-picker-target="priceContainer"]').locator('p').last()
        this.observerTarget = this.page.locator('[data-plp-variant-picker-target="colorsContainer"]')
        this.hasDiscount = page.getByText(' Sale ')
        this.sectionColour = {}
    }
    async openUrl() {
        await this.page.goto("https://demo.spreecommerce.org/", { waitUntil: "domcontentloaded" });

    }
    async getProductLocator() {
        let objProducts = {}
        const listOfSections = await this.sectionLocator.all()
        this.sectionColour = {}
        for (let m = 0; m < listOfSections.length; m++) {
            await listOfSections[m].scrollIntoViewIfNeeded()
            await this.page.waitForTimeout(2000)
            const listOffProducts = await listOfSections[m].locator('[data-controller="plp-variant-picker"]').all()
            const sectionId = await listOfSections[m].getAttribute('id')
            this.sectionColour[`${sectionId}`] = []
            for (let i = 0; i < listOffProducts.length; i++) {
                await listOffProducts[i].locator('h3').first().waitFor({ state: "visible" })
                const sectionProductId = await listOffProducts[i].getAttribute('id')
                const sectionProductHref = await listOffProducts[i].locator('[data-plp-variant-picker-target="link"]').getAttribute('href')
                const hasColourPicker = await listOffProducts[i].locator(this.colourPicker).count() > 0
                const hasDiscount = await listOffProducts[i].locator(this.hasDiscount).count() > 0
                const allColors: Locator[] = await listOffProducts[i].locator(this.observerTarget).locator('[data-variant-id]').all()
                this.sectionColour[`${sectionId}`].push(...allColors)

                objProducts[`${sectionProductId}`] = {
                    'section.product.id': sectionProductId,
                    'section.product.link': sectionProductHref,
                    'section.product.name': (await listOffProducts[i].locator('h3').textContent())?.trim(),
                    "section.title": (await listOfSections[m].locator('h3[data-title]').textContent())?.trim(),
                    "section.id": sectionId,
                    "section.product.language": await this.language.textContent(),
                    "section.product.price.currency": (await this.currency.textContent())?.trim(),
                    "section.product.colourPicker.hasColourPicker": await listOffProducts[i].locator(this.colourPicker).count() > 0,
                    ...(hasColourPicker
                        ? {
                            "section.product.colourPicker.values": await listOffProducts[i].locator('[data-plp-variant-picker-target="colorsContainer"] [data-color]')
                                .evaluateAll(nodes => nodes.map(n => n.getAttribute('data-color')?.toString()).join(","))
                        }
                        : { "section.product.colourPicker.values": "" }
                    ),
                    "section.product.price.hasDiscount": hasDiscount,
                    ...(hasDiscount
                        ? { "section.product.price.discountPrice": await listOffProducts[i].locator(this.discountPrice).textContent() }
                        : { "section.product.price.discountPrice": "no discount" }
                    ),
                    "section.product.price.regularPrice": await listOffProducts[i].locator(this.regularPrice).textContent(),
                }

            }
        }

        return objProducts
    }
    get getSectionLocator() {
        return this.sectionLocator
    }
    get getSectionColour() {
        return this.sectionColour
    }
}

