**Page Objects & Logic**


CrawlerGenerate is a type-driven validator that ensures the structure of your product data matches exactly what you expect from the main page.

It works in three layers:

Crawler type → describes the ideal shape of a product as it should appear in the DOM.

GWS1C type utility → flattens that nested shape into dot-notation keys (like "section.product.price.currency").

CrawlerGenerate.validate method → uses a type guard + a schema dictionary to verify at runtime that what you scraped actually matches the type system.


1. Crawler

This is your source of truth for what product objects must contain.
It specifies:

section metadata (title, id),

product core fields (id, name, link, language),

product features (colour picker, price, discount).

2. GWS1C generic
type GWS1C<T, Prefix extends string = ''> =
  T extends object
    ? { [K in keyof T]:
          GWS1C<T[K],
            K extends string
              ? `${Prefix extends "" ? K : `${Prefix}.${K}`}`
              : ""
          >
      }[keyof T]
    : Prefix


This recursive mapped type does the magic:

Walks through a nested object (Crawler)

For each property, it recursively builds strings in dot notation (prefix + key).

When it reaches a leaf (string, number, boolean), it outputs the full path string.

So for Crawler, the result is:

type tryGW =
  | "section.title"
  | "section.id"
  | "section.product.id"
  | "section.product.name"
  | "section.product.link"
  | "section.product.language"
  | "section.product.colourPicker.hasColourPicker"
  | "section.product.colourPicker.values"
  | "section.product.price.hasDiscount"
  | "section.product.price.regularPrice"
  | "section.product.price.discountPrice"
  | "section.product.price.currency"


This guarantees your schema dictionary has no typos and no missing keys, because tryGW comes directly from the Crawler type.

3. isTryGW Type Guard
const isTryGW = (key: string | tryGW): key is tryGW => {
    return key as tryGW in valid
}


This function checks if a string key exists in the schema dictionary.

The important part: it narrows the type of key to tryGW inside the validation logic.

Without this, TypeScript would complain that key could be any string.

4. validate Method
validate(combined: basicElements): boolean {
    ...
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


What happens here:

Iterate through all scraped product data (combined).

For each key, confirm it belongs to the expected flattened schema (tryGW).

Compare the runtime type of the actual value (typeof value) to what the schema dictionary says it should be (expected).

Fail fast if:

You get an unexpected property, or

A type mismatch (e.g. a string where a boolean was expected).

This gives you a runtime guarantee that the data really matches your Crawler type.

**Test File**
That single line is the heart of the test:

combined.getProductLocator() scrapes the live page.

crawler.validate(...) runs your type guard validator.

If every product and section matches your expected schema, it passes.

If anything changes in production (a renamed field, missing discount, wrong type), the test catches it immediately.
