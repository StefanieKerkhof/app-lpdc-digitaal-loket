import { Locator, Page, expect } from "@playwright/test";
import { AbstractPage } from "./abstract-page";
import { Table } from "../components/table";

export class AddProductOrServicePage extends AbstractPage {
    private readonly header: Locator;
    readonly resultTable: Table;

    private constructor(page: Page) {
        super(page);

        this.header = page.getByRole('heading', { name: 'Product of dienst toevoegen' });
        this.resultTable = new Table(page);        
    }

    static create(page: Page): AddProductOrServicePage {
        return new AddProductOrServicePage(page);
    }

    async expectToBeVisible() {
        await expect(this.header).toBeVisible();
    }

}