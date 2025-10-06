import {test, expect} from '@playwright/test';
import { WorkflowPage } from '../../pages/WorkflowPage';
import { login } from '../../utils/login';


test('TC-5: Create a Builder Map via Workflow', async ({page}) => {
    const workflow = new WorkflowPage(page);

    await login(page);
    await workflow.open();
    await workflow.openWorkflowByName('TestWorkflow');
    await workflow.runWorkflow();
    await workflow.waitForWorkflowToCompleteSuccess();
    
    await workflow.openMapDataTab();
    const mapUrl = await workflow.getBuilderMapLink();
    expect(mapUrl).not.toBeNull();

    const mapPage = workflow.currentPage;
    
    await mapPage.goto(mapUrl!);
    expect (mapPage.url()).toContain('/builder/');

    await mapPage.waitForSelector('canvas#default-deckgl-overlay', { timeout: 15000 });
    await mapPage.waitForSelector('div.layer-manager-title', { timeout: 15000 });

    const matches = mapPage.getByText('ca_filtered').first();
    const nonmatches = mapPage.getByText('filtered_out').first();

    await expect(matches).toBeVisible();
    await expect(nonmatches).toBeVisible();
});