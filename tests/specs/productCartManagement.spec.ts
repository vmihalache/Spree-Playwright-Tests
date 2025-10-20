import test, { expect } from "@playwright/test";
import { Operation } from "../pages/productComposite";
test('should make sure the pom methods work', async ({ page, context }) => {
    await page.context().clearCookies();
    test.setTimeout(600000); 
    const operation = new Operation(page)
    const financialResult = await operation.operate()
    expect(financialResult).toBeTruthy()
})