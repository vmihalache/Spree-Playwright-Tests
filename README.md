# Spree Playwright Tests

End-to-end tests for the [Spree Commerce Demo](https://demo.spreecommerce.org/) site using [Playwright](https://playwright.dev/).

This project validates main page products and tests interactive color switching. Future work will expand to cart and checkout flows.

---

## Project Structure

/Spree-Playwright-Tests/
├── README.md
├── tests/
│ ├── observerColour.spec.ts # Tests product colour switch observer
│ └── testPom.spec.ts # Tests crawler schema validation
├── stories/
│ └── CrawlerValidator&&CrawlerImageObserver.md
├── layers/
│ ├── ColourImageObserver-layer.md
│ └── CrawlerGenerator-layer.md
└── AI-usage.md


---

## Prerequisites

- [Node.js](https://nodejs.org/) v20.0.0 or higher  
- Install dependencies:  
  ```bash
  npm install -D @playwright/test

Running Tests

Run all tests:
npx playwright test

Run a specific file:
npx playwright test tests/observerColour.spec.ts
npx playwright test tests/testPom.spec.ts


Key Concepts
Page Object Model (POM)

Encapsulates page elements and actions to promote reuse, abstraction, and maintainability.

Layered Architecture

Separates concerns into pages, specs, and utils, making it easier to evolve and debug.

Current Test Coverage

✅ Main page product type validation (CrawlerGenerate class)

✅ Colour switching interaction with mutation observer (ColourImageObserver)

🔜 Cart management and checkout flows

Known Issues / TODO

Better logging for crawler schema mismatches

Add cross-browser stability fixes for Firefox lazy-loaded frames

Expand coverage to cart operations and checkout



Notes on AI Assistance

This project selectively used AI assistance for:

Debugging tricky typeguard and schema validation logic

Suggesting branching workflows and conflict resolution

Prototyping observer logic for color switch changes

Final implementations, decisions, and ownership remain with the project author.


Contribution

Pull requests and issues are welcome!

Open an issue for bugs or new feature requests.

Submit a PR to extend coverage, improve code quality, or refine documentation.