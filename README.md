# Spree Playwright Tests
[![Playwright Tests](https://github.com/vmihalache/Spree-Playwright-Tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/vmihalache/Spree-Playwright-Tests/actions/workflows/playwright.yml)
![Node.js version](https://img.shields.io/badge/node-%3E%3D24.0.7-brightgreen)
![Playwright](https://img.shields.io/badge/playwright-latest-blue?logo=playwright)
```
End-to-end tests for the [Spree Commerce Demo](https://demo.spreecommerce.org/) site using [Playwright](https://playwright.dev/).

This project validates main page products and tests interactive color switching. It also covers cart and checkout flows.
This Playwright automation system is built as a multi-pattern architecture combining Page Object Model, Factory, Builder, Strategy, and Composite principles.
It provides a modular, maintainable, and extensible foundation for verifying e-commerce cart and checkout logic.
Each layer is independently testable, promotes reusability, and aligns with clean architecture principles — making it suitable for both exploratory and CI-driven regression testing.

## Project Structure
```
/Spree-Playwright-Tests/
├── README.md
├── tests/
│ ├── observerColour.spec.ts # Tests product colour switch observer
│ └── testPom.spec.ts # Tests crawler schema validation
| └── productCartManagement.spec # Cart and checkout flow validation
| 
| 
├── stories/
│ └── CrawlerValidator&&CrawlerImageObserver.md
| └── CartProcessBuyValidator.md
├── layers/
│ ├── ColourImageObserver-layer.md
│ └── CrawlerGenerator-layer.md
| └── CrawlerGenerator-layer.md 
└── AI-usage.md
```
This is a chart of the Cart/Checkout flows based on design patterns. 
┌──────────────┐
│  collector   │──► Raw Product Data
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  factory     │──► Filtered Product Objects
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  pagePom     │──► Navigation + Data Gathering
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ innerView    │──► UI Actions + Element State
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ builder      │──► Price Construction
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ strategy     │──► Price Calculation
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ composite    │──► Cart Validation + Total Comparison
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ spec         │──► Final Test Assertion
└──────────────┘


```
## Prerequisites
```
- [Node.js](https://nodejs.org/) v20.0.0 or higher  
- Install dependencies:  
  ```bash
  npm install -D @playwright/test
```
## Running Tests
```
Run all tests:
npx playwright test

Run a specific file:
npx playwright test tests/observerColour.spec.ts
npx playwright test tests/testPom.spec.ts
npx playwright test tests/specs/productCartManagement.spec.ts
```

## Key Concepts
```
Page Object Model (POM)
Encapsulates page elements and actions to promote reuse, abstraction, and maintainability.
Layered Architecture: Enforces separation of concerns via distinct layers (POM, Collector, Builder/Strategy/Composite), which guarantees high testability, easy maintenance, and clear decoupling between UI actions and business logic.

Current Test Coverage
✅ Main page product type validation (CrawlerGenerate class)
✅ Colour switching interaction with mutation observer (ColourImageObserver)
🔜 Cart management and checkout flows (productCartManagement)

```
## Known Issues / TODO
```
Better logging for crawler schema mismatches
Add cross-browser stability fixes for Firefox lazy-loaded frames
```
## Notes on AI Assistance
```
This project selectively used AI assistance for:
Debugging tricky typeguard and schema validation logic
Suggesting branching workflows and conflict resolution
Prototyping observer logic for color switch changes
Final implementations, decisions, and ownership remain with the project author.
```
## Contribution
```
Pull requests and issues are welcome!
Open an issue for bugs or new feature requests.
Submit a PR to extend coverage, improve code quality, or refine documentation.
```
