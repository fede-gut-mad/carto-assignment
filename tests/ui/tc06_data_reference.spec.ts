import { test, expect } from '@playwright/test';
import { WorkflowPage } from '../../pages/WorkflowPage';
import { login } from '../../utils/login';

test('TC-6: Data Reference visible in Map', async ({page}) =>{

    const wfName = process.env.CARTO_WORKFLOW_NAME || 'TestWorkflow';
    const MATCHES = process.env.MATCHES_TABLE || 'ca_filtered';
    const NONMATCHES = process.env.NONMATCHES_TABLE || 'filtered_out';

    const workflow = new WorkflowPage(page);

    await login(page);
    await workflow.open();
    await workflow.openWorkflowByName('TestWorkflow');
    await workflow.runWorkflow();

    await workflow.openMapDataTab();
    const mapUrl = await workflow.getBuilderMapLink();

    const mapPage = workflow.currentPage;
    await mapPage.goto(mapUrl!);

    await mapPage.waitForSelector('canvas#default-deckgl-overlay', { timeout: 15000 });
    await mapPage.waitForSelector('div.layer-manager-title', { timeout: 15000 });

    const matches = mapPage.getByText('ca_filtered').first();
    const nonmatches = mapPage.getByText('filtered_out').first();
    
    //Assert datasources are visible
    await expect(matches).toBeVisible();
    await expect(nonmatches).toBeVisible();

    //Assert layers are visible
    const firstLayer = mapPage.locator('input[value="Layer 1"]')
    const secondLayer = mapPage.locator('input[value="Layer 2"]')
    await expect(firstLayer).toBeVisible();
    await expect(secondLayer).toBeVisible();

    //Assert datasource is referenced in layer
    await firstLayer.click();
    await mapPage.locator('li.MuiMenuItem-root').waitFor({ state: 'visible', timeout: 15000 });
    await expect(matches).toBeVisible();


    




});

