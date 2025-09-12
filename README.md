
Project Overview
This repository contains Playwright end-to-end tests for the demo.spreecommerce website.
It covers main page products validation of products and interaction with the products colour switches.
Project Structure. It will also cover product cart management in the near future.
/demo.spree-playwright-tests/
├── README.md
├── tests/
│ └── observerColour.spec.ts
│ └── testPom.spec.ts

├── stories/
│ └─CrawlerValidator&&CrawlerImageObserver.md
├── layers/
│ └── ColourImageObserver-layer.md
| └── CrawlerGenerator-layer.md
│ └── CrawlerGenerator-layer.md 
└── AI-usage.md


Prerequisites
Node.js v24.0.7 or higher
Playwright installed (npm install -D @playwright/test)

Running Tests
npx playwright test

To run a specific test file:

npx playwright test tests/specs/observerColour.spec.ts 
npx playwright test tests/specs/testPom.spec.ts

Key Concepts
Page Object Model (POM):
Encapsulates page elements and actions to promote reuse and abstraction.

Layered Architecture:
Separates concerns into pages, specs and utils.

Current Test Coverage
Main page products type validation and colour switching interaction

Known Issues / TODO
Test stability: Some selectors (e.g., turbo-frame sections) are sensitive to lazy loading, may require retries or explicit waits.
Firefox/WebKit coverage: Occasionally slower, needs additional stabilization.
Documentation gaps: Observer logic and schema validation could use more developer-facing docs.
Cart flow (planned): Add cart management scenarios (add/remove/update products, discounts).

Notes on AI Assistance
This project includes selectively used AI-assisted suggestions, primarily for debugging edge cases or prototyping.
All implementations and final decisions were made by the author to ensure full understanding, ownership, and quality.

Contribution
Feel free to open issues or PRs to improve test coverage, structure, or code quality.
