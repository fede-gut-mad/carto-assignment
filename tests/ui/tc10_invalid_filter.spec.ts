import { test } from '@playwright/test';
import { WorkflowPage } from '../../pages/WorkflowPage';
import { login } from '../../utils/login';

test.describe.serial('TC-10: Invalid filter', () => {
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

    try {
      await workflow.openFilterPanel();
      await workflow.setColumnName('statefp');    
      await workflow.setFilterExpression('Canada'); 
      await workflow.runWorkflow();
      await workflow.waitForWorkflowToCompleteFail();
    } finally {
      //Cleanup
      await workflow.openFilterPanel();
      await workflow.setColumnName(BASE_COLUMN);
      await workflow.setFilterExpression(BASE_VALUE);
      await workflow.runWorkflow();
      await workflow.waitForWorkflowToCompleteSuccess();
    }
  });
});
