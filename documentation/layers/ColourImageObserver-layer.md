ColourImageObserver Rundown
Purpose

This class encapsulates logic for observing DOM mutations on a product’s featured image container.
It bridges browser-side DOM events (MutationObserver) with your Playwright test runtime, letting you verify that UI changes (like switching product colors) actually trigger the expected DOM updates.

Key Properties

page: Page
Reference to the Playwright Page object, enabling script injection and communication.

mutationDataType: Object | null
Tracks the type of the most recent mutation (childList, attributes, etc.).

mutationDataAddedNodes: number | null
Number of nodes added in the last mutation.

mutationDataRemovedNodes: number | null
Number of nodes removed in the last mutation.

Core Methods

handleMutation()

Prepares the test runtime to receive mutation events from the browser.

Uses page.exposeFunction('notifyNodeOfMutation') to define a callback that the browser’s MutationObserver can call.

Updates internal state (mutationDataType, mutationDataAddedNodes, mutationDataRemovedNodes).

➝ Think of this as “opening the communication channel.”

handleObserver(sectionLocator: string)

Runs inside the browser context via page.evaluate().

Creates a new MutationObserver attached to the product image container.

Whenever a DOM mutation occurs, it calls the exposed notifyNodeOfMutation function (which Playwright receives).

Handles error cases gracefully with debug logs:

❌ Target frame not found

❌ Image container not found

➝ This is where the observer starts watching.

disconnectObserver()

Stops the MutationObserver by disconnecting it inside the browser context.

Prevents memory leaks and ensures no duplicate observers run across tests.

➝ Clean shutdown of the observer.

stopObserver(observer: MutationObserver)

Disconnects a passed-in observer (alternative to disconnectObserver(), which runs inside page context).

Less commonly used since you usually manage it inside the browser context.

Getters

getMutationDataType, getMutationDataAddedNodes, getMutationDataRemovedNodes
➝ Safe accessors for the mutation state, making it test-friendly.

How It Fits in the Test Flow

Start the test and navigate to the page.

Call handleMutation() to register the cross-context bridge.

Call handleObserver(sectionLocator) to start watching a product image container.

Perform user actions (e.g., click a color option).

MutationObserver detects DOM changes and sends data back to Playwright.

Use expect(observer.getMutationDataAddedNodes).toBeGreaterThan(0) or similar assertions.

Call disconnectObserver() to stop watching.

What Makes It Strong

Direct DOM monitoring: You’re not just assuming the UI changed, you’re observing the actual DOM mutation events.

Integration with Playwright: exposeFunction bridges browser events to Node, so your test can assert them.

Flexibility: Can observe any section simply by passing a locator string.

Debug resilience: Helpful console logs to track observer setup success/failure.

✅ In short:

handleMutation opens the bridge.

handleObserver starts observing a specific section.

disconnectObserver stops observation.

Data is captured in mutationData* fields for easy assertions.





Sample Test Scenario

Goal: Verify that when a user selects a different product colour, the featured product image updates (mutation event observed).

Setup Phase

Create Page Objects

Instantiate MainPagePom with the Playwright page.

Instantiate ColourImageObserver with the same page.

Navigate

Call mainPagePom.openUrl() → lands on Spree’s homepage.

Observer Prep

Mutation Bridge

Call observer.handleMutation() → sets up the exposed notifyNodeOfMutation function.

Attach Observer

Call observer.handleObserver(sectionLocator) with a specific section ID (say "section-1").

This starts watching the image container for changes.

Action

Trigger a Colour Change

Use mainPagePom.getProductLocator() to fetch product elements.

Find a product that has a colour picker.

Click one of the colour swatches.

Observation

Wait for Mutation

The browser-side MutationObserver fires when the product image updates.

Data flows back to Playwright:

mutationDataType = "childList" (or "attributes")

mutationDataAddedNodes > 0

mutationDataRemovedNodes ≥ 0

Assertions

Validate Mutation Happened

Check that observer.getMutationDataType is either "childList" or "attributes".

Assert that at least 1 added or removed node is recorded.

Validate Data Consistency

Optionally re-run mainPagePom.getProductLocator() to fetch product state again.

Compare colour picker values before vs. after to confirm the UI really changed.

Teardown

Disconnect

Call observer.disconnectObserver() to stop observing the section.

✅ So the story is:

MainPagePom = how we find and act on the product UI.

ColourImageObserver = how we watch and confirm that the DOM reacted.

Together, they cover action → mutation → verification without relying only on static snapshots.