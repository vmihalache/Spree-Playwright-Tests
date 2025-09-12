import { test, expect } from '@playwright/test';
import { MainPagePom } from '../pages/mainPagePom';
import { getMainPagePom } from '../utils/spreeCrawler';

test.describe('CrawlerGenerate - Main Page Product Checks', () => {

    test('should retrieve all products from all sections', async ({ page }) => {
        // TODO: instantiate MainPagePom
        const mainPagePom = new MainPagePom(page);

        // TODO: open main page
        await mainPagePom.openUrl();

        // TODO: get all sections and products
        const sections = await getMainPagePom(page);

        // TODO: assertions placeholder
        // expect(sections).toBeDefined();
    });

});
