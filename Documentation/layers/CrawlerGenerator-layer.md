
MainPagePom is a Page Object Model (POM) for the Spree Commerce main page.
It abstracts away raw Playwright selectors and provides structured access to:

Sections (frames on the homepage)

Products (inside each section)

Product attributes (title, price, colour options, etc.)

On top of that, it builds a structured object (objProducts) that matches the schema from your Crawler type — so the scraper and the validator can work together.

🔹 Class Structure
Fields

Each readonly property is a locator — a handle to a specific DOM element.
Examples:

sectionLocator → all section <turbo-frame> containers.

colourPicker → the container for product colour swatches.

regularPrice / discountPrice → price elements inside each product card.

⚡ This avoids hardcoding selectors everywhere. If the HTML changes, you update it once here.

Constructor
constructor(page: Page) {
    this.page = page
    this.sectionLocator = this.page.locator('turbo-frame[id^="section-"]')
    this.sectionTitle = this.page.locator('data-title')
    this.language = this.page.locator('button[data-action="modal#open"]').locator('span').last()
    this.currency = this.page.locator('button[data-action="modal#open"]').locator('span').first()
    ...
    this.sectionColour = {}
}


Takes a Page (Playwright browser tab).

Initializes all locators with CSS/XPath selectors that correspond to the site’s structure.

Initializes sectionColour as an empty object — it’ll later store swatch locators grouped by section.

openUrl()
async openUrl() {
    await this.page.goto("https://demo.spreecommerce.org/", { waitUntil: "domcontentloaded" });
}


Navigates to the homepage.

Uses domcontentloaded → ensures base HTML is there (faster than waiting for full load).

getProductLocator()

This is the core scraper method.

What it does step by step:

Create an empty results object:

let objProducts = {}
this.sectionColour = {}


Get all homepage sections:

const listOfSections = await this.sectionLocator.all()


For each section (for m loop):

Scroll into view (ensures lazy-loaded products appear).

Collect all product cards inside it.

Extract the section ID (id="section-123").

Initialize sectionColour[sectionId] = [] for swatch storage.

For each product (for i loop inside section):

Wait until product title (h3) is visible (syncs with DOM).

Collect product attributes:

id (HTML id)

href (product detail link)

name (from <h3>)

section.title and section.id

Global values like language and currency.

Detect feature flags:

hasColourPicker → is swatch container present?

hasDiscount → is a “Sale” tag present?

If colour picker exists:

Grab all swatch <data-color> attributes → join them as comma-separated string.

If discount exists:

Extract discount price, otherwise set "no discount".

Push all swatch locators into sectionColour[sectionId].

Add structured product info into objProducts:

objProducts[sectionProductId] = {
    "section.product.id": ...,
    "section.product.name": ...,
    "section.product.link": ...,
    "section.product.language": ...,
    "section.product.colourPicker.hasColourPicker": ...,
    ...
}

Return Value

At the end:

return objProducts


You get a flat object mapping product IDs → product data.

Keys match the dot-notation schema from tryGW.

This ensures CrawlerGenerate.validate() can run directly on it.

Getters
get getSectionLocator() {
    return this.sectionLocator
}
get getSectionColour() {
    return this.sectionColour
}


Convenience getters → provide controlled access to locators and colour swatches.

For example, getSectionColour is used later by ColourImageObserver to track hover events.

🔹 Why This Is Good

Encapsulation → all selectors live in one place.

Consistency → outputs exactly match your validator schema.

Flexibility → sectionColour is reusable both in crawler validation and in hover observer tests.

Robustness → waits for visibility, scrolls sections into view, handles missing features gracefully.

✅ In one sentence:
MainPagePom is the single source of truth for scraping the main page: it converts raw DOM into a structured schema-ready object (objProducts) and provides utilities like section-level swatch tracking, making it the backbone of both your crawler validation and your colour observer specs.