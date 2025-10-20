| Layer                      | Files                                      | Core Pattern                | Primary Responsibility                              |
| -------------------------- | ------------------------------------------ | --------------------------- | --------------------------------------------------- |
| **Collector Layer**        | `collector.ts`                             | *Crawler / Data Provider*   | Retrieves live product data from storefront         |
| **Factory Layer**          | `productFactory.ts`                        | *Factory + Template Method* | Produces filtered sets of product entities          |
| **Page Interaction Layer** | `productPagePom.ts`, `productInnerView.ts` | *Page Object Model (POM)*   | Encapsulates UI navigation and interactions         |
| **Business Logic Layer**   | `productBuilder.ts`, `productStrategy.ts`  | *Builder + Strategy*        | Handles calculation rules (price × quantity)        |
| **Composition Layer**      | `productComposite.ts`                      | *Composite + Orchestrator*  | Aggregates and validates multi-product totals       |
| **Spec Layer**             | `productCartManagement.spec.ts`            | *Test Executor*             | Drives the overall test scenario, validates results |

File-by-File Breakdown
🧱 ***collector.ts — Raw Data Collector***

***Purpose:***
Acts as the entry point for data acquisition.
Fetches a list of available products by crawling the SpreeCommerce homepage.

Patterns Used:

Crawler / Data Provider

Retry Pattern (recursion when empty results)

Strengths:

Self-healing logic retries when no data is found.

Uses waitUntil: "domcontentloaded" for speed and stability.

Improvement Points:

Recursion lacks a maximum depth → add an exit guard to prevent infinite loops.

Could store results to cache for faster re-runs.


🧱 ***productFactory.ts — Product Factory***

*** Purpose ***:
Builds a structured list of products, filters them based on properties (like sizeAvailable, quantityAvailable), and enriches with details from ProductPagePom.

Patterns Used:

Factory Method Pattern for product creation.

Template Method Pattern for filtering steps.

Strengths:

Clean decoupling between data collection and interaction logic.

Easily extensible — add new factories for different test categories.

Risks / Notes:

Dependent on field naming conventions from collector.ts.

Potential performance overhead if product list is large (every product triggers a full navigation).


🧱 ***productPagePom.ts — Page Orchestrator***

***Purpose:***
Manages navigation across product pages, invoking lower-level ProductInnerView for interactions and capturing computed results.

Patterns Used:

Page Object Model (POM)

Aggregator Pattern

Strengths:

Decouples navigation from element-level actions.

Central orchestrator for composite operations.

Risks / Notes:

Random selection logic may cause nondeterministic CI runs (add a seed for reproducibility).

Error handling (timeouts, failed loads) could use retry encapsulation.


🧱 ***productInnerView.ts — Element Interaction Controller***

***Purpose:***
Encapsulates granular UI interactions (quantity, size, “add to cart”, verifying totals).

Patterns Used:

Atomic POM / Command Pattern hybrid — exposes all actions dynamically through a getter (actions).

Strengths:

Self-contained interactions; every action is independent and mockable.

getEmptyResult() provides graceful fallback for missing elements.

Good use of locator scoping to avoid selector collisions.

Risks / Notes:

Fixed timeouts (waitForTimeout(1000–2000)) → replace with conditional waits.

Cache behavior may cause async race conditions under parallel execution.


🧱 ***productBuilder.ts — Price Builder***

***Purpose***:
Provides a fluent interface for constructing a price context (base price, discount price).

Patterns Used:

Builder Pattern

Fluent API Design

Strengths:

Clean syntax: .hasBasicPrice(...).hasDiscountPrice(...).calculate()

Handles missing discounts gracefully (defaults to 0).

Risks / Notes:

Internal state not immutable — could introduce side effects in parallel scenarios.

Return types could be expanded to PriceObject for clarity.


🧱 ***productStrategy.ts — Price Calculation Strategy***

***Purpose:***
Defines the algorithm for computing the final price per product.

Patterns Used:

Strategy Pattern

Strengths:

Cleanly separates pricing logic from UI or data handling.

Easy to extend for new calculation modes (e.g., tax-inclusive, bulk discount).

Risks / Notes:

Rounding logic may produce floating errors; consider using a precise arithmetic library (e.g. decimal.js).


🧱 ***productComposite.ts — Cart Manager + Composite Validator***

***Purpose***:
Aggregates all product-level calculations, sums them, and validates against the checkout total displayed in the UI.

Patterns Used:

Composite Pattern (CartManagement manages multiple ProductCompositeHolder objects)

Strategy Pattern (delegates pricing to CalculatePayment)

Template + Orchestrator Pattern (the Operation class drives the full scenario)

Strengths:

Very elegant structure — clear separation of aggregation and execution.

Uses composition over inheritance, allowing test extension.

Validates both frontend and backend-calculated totals for accuracy.

Risks / Notes:

Uses regex string manipulation on totals — may break with locale differences (e.g., commas for decimals).

Asynchronous mapping with Promise.all — safe, but could introduce concurrency issues if DOM elements are mutated mid-loop.


🧱 ***productCartManagement.spec.ts — Spec Executor**

***Purpose:***
Top-level test driver. Launches the entire pipeline, clears context state, executes operation, and asserts final consistency.

Patterns Used:

End-to-End Orchestrator

Strengths:

One-line assertion (expect(financialResult).toBeTruthy()) abstracts a deeply complex flow.

Clean setup/teardown (context reset before execution).

High cohesion — each run tests a real-world shopping flow, not just isolated functions.

Risks / Notes:

Single test structure limits reporting granularity (consider splitting into subtests per flow).

The 10-minute timeout (600000) may hide slowdowns; introduce performance metrics logging