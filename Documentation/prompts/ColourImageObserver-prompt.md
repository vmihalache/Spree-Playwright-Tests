import { test, expect } from '@playwright/test';
import { MainPagePom } from '../pages/mainPagePom';
import { ColourImageObserver } from '../utils/observer';

test.describe('ColourImageObserver - Hover Color Validation', () => {

    test('should hover each color switch and validate changes', async ({ page }) => {
        // TODO: instantiate MainPagePom
        const mainPagePom = new MainPagePom(page);

        // TODO: instantiate ColourImageObserver
        const colourObserver = new ColourImageObserver(page);

        // TODO: open main page
        await mainPagePom.openUrl();

        // TODO: iterate through sections & products
        // TODO: hover each color and validate changes
        // expect(colourObserver.mutationDataType).toBe('childList');
    });

});
