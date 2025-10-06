import { test, expect } from '@playwright/test';
import { WorkflowPage } from '../../pages/WorkflowPage';
import { login } from '../../utils/login';

test.describe.serial('TC-7: Change Filter Values', () => {
  test('shows error and then restores baseline', async ({ page }) => {
    const wfName = process.env.CARTO_WORKFLOW_NAME || 'TestWorkflow';
    const BASE_COLUMN = process.env.BASE_COLUMN || 'name';
    const BASE_VALUE  = process.env.BASE_VALUE  || 'California';

    const workflow = new WorkflowPage(page);

    await login(page);
    await workflow.open();                 
    await workflow.openWorkflowByName(wfName);

    // set baseline filter
    await workflow.openFilterPanel();
    await workflow.setColumnName(BASE_COLUMN);
    await workflow.setFilterExpression(BASE_VALUE);
    await workflow.runWorkflow();
    await workflow.waitForWorkflowToCompleteSuccess();

    // await workflow.openMapDataTab();  // ensure Data panel is showing something consistent
    await workflow.openDataTab();
    await workflow.openFilterPanel();
    const baseSummary = await workflow.readTableResultsHeader();

    try {
      //modify filter to something else and check summary changes
      await workflow.openFilterPanel();
      await workflow.setFilterExpression('Colorado'); 
      await workflow.runWorkflow();
      await workflow.waitForWorkflowToCompleteSuccess();

      // Re-open the Simple Filter node’s Data tab
    //   await workflow.openMapDataTab();
        
        await workflow.openDataTab();
        await workflow.openFilterPanel();
      const changedSummary = await workflow.readTableResultsHeader();

      // Compare actual text values, not Locators
      expect(changedSummary, 'Summary should change after switching to Colorado').not.toEqual(baseSummary);
     } finally {
      //Cleanup
      await workflow.openFilterPanel();
      await workflow.setColumnName(BASE_COLUMN);
      await workflow.setFilterExpression(BASE_VALUE);
      await workflow.runWorkflow();
    //   await workflow.currentPage.waitForTimeout(60000); // give workflow a bit of time to start
      await workflow.waitForWorkflowToCompleteSuccess();
    }
  });
});