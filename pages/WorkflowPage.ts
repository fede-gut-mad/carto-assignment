import {Page, expect} from '@playwright/test';

const selectors = {
  workflowTitlepage: 'h5',
  workflowItem:'div.css-flx8yu',
  runWorkflowButton: 'button[data-testid="run-button"]',
  simpleFilterNode: 'div[data-testid="rf__node-dc3f4b30-eadb-4f85-8939-1b88065b3dff"]',
  nodeTitle: 'h2',
  filterValue: 'input#Value',
  resultsDataSummary: 'p[data-testid="workflows-header-data-summary"]',
  resultsDataTableRow:'tbody.MuiTableBody-root.css-1xnox0e',
  builderMapNode: 'div[data-testid="rf__node-13c47f25-7f77-4c2f-85fb-25ae297be32d"]',
  builderMapLink: 'td > a.MuiLink-root',
}

export class WorkflowPage {
    private originalPage: Page;

    constructor(private page: Page) {
        this.page = page;
        this.originalPage = page;
    }

    get currentPage(): Page {
        return this.page;
      }

    async switchBackToOriginal() {
    this.page = this.originalPage;
    }


    // open workflows section
    async  open () {
        await this.page.goto('/workflows');
        //assert we are in the right page
        expect(this.page.locator(selectors.workflowTitlepage))
          .toHaveText('Workflows');
    }

    async openWorkflowByName(name: string) {
        // Start waiting for new page before clicking
        await this.page.getByRole('textbox', { name: 'Search workflow' })
          .fill(name);
        
        //handle new tab if it appears
        const [popup] = await Promise.all([
        this.page.waitForEvent('popup', { timeout: 10000 }).catch(() => null),
        this.page.locator(selectors.workflowItem)
          .first()
          .click()
        ]);

         // If a new tab opened, assert there; otherwise assert on the same page
        const target: Page = popup ?? this.page;

        if (popup) {
            await popup.waitForLoadState('domcontentloaded');
            this.page = popup;
          }

        // Wait for a success message
        await expect(
            target.getByText(
              'Workflow execution completed successfully', 
              { exact: true }
            ).first()
          ).toBeVisible({ timeout: 120000 });
    }

    async runWorkflow() {
        const runButton = this.page.locator(selectors.runWorkflowButton)
        await runButton.waitFor({ state: 'visible', timeout: 200000 });
        await runButton.click();
    }

    async waitForWorkflowToCompleteSuccess() {
        // Wait for a success message
        await expect(
            this.page.getByText('Workflow execution completed successfully')
              .first()
          ).toBeVisible({ timeout: 300000 });
    }

    async waitForWorkflowToCompleteFail() {
        // Wait for a fail message
        await expect(this.page.getByText('Workflow executed with errors')
          .first())
          .toBeVisible({ timeout: 300000 });
    }

    async openFilterPanel() {
        const simpleFilterNode = this.page.locator(selectors.simpleFilterNode);
        await simpleFilterNode.waitFor({ state: 'visible', timeout: 15000 });
        await simpleFilterNode.click();
        expect(this.page.locator(selectors.nodeTitle)).toBeVisible();
      }

      async setColumnName(value: string) {
        const columnSelect = this.page.getByRole('combobox', { name: 'Column' })
        await columnSelect.waitFor({ state: 'visible', timeout: 20000 });
        await columnSelect.click();
        await this.page.locator(`li[data-value="${value}"]`)
          .click();
      }
      
      async setFilterExpression(value: string) {
        await this.page.locator(selectors.filterValue).fill(value);
      }

      async getSelectorText(selector:string){
        const selectorText = this.page.locator(selector).first();
        return selectorText;
      }

      async readTableResultsHeader(): Promise<string> {
        const el = this.page.locator(selectors.resultsDataSummary).first();
        await el.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.locator(selectors.resultsDataTableRow)
          .first()
          .waitFor({ state: 'visible', timeout: 30000 });
        const txt = await el.innerText();
        return (txt || '').trim();
      }

      async openMapDataTab() {
        const mapBuilderNode = this.page.locator(selectors.builderMapNode).first();
        await mapBuilderNode.click();
        await this.openDataTab();
      }

      //   Look for a field/row that contains a URL and try to read its href 
      async getBuilderMapLink(){
          await this.page.locator(selectors.builderMapLink)
            .waitFor({ state: 'visible', timeout: 10000 }); 
          const link = this.page.locator(selectors.builderMapLink); 
          if (
            await link.first().isVisible().catch(() => false)
          ) { 
            return (await link.first().getAttribute('href')) || null; 
          } 
            return null;
      }

      async openDataTab() {
        const dataTab = this.page.locator('button', { hasText: 'Data' })
          .first();
        await dataTab.waitFor({ state: 'visible', timeout: 20000 });
        await dataTab.click();
      }
    

}