import {APIRequestContext, expect, Page, test} from '@playwright/test';
import {lpdcUrl, reportGenerationUrl} from "../test-api/test-helpers/test-options";
import {MockLoginPage} from "./pages/mock-login-page";
import {first_row} from "./components/table";
import fs from "fs";
import {UJeModal} from "./modals/u-je-modal";
import {LpdcHomePage} from "./pages/lpdc-home-page";
import {AddProductOrServicePage as ProductOfDienstToevoegenPage} from "./pages/product-of-dienst-toevoegen-page";
import {ConceptDetailsPage} from "./pages/concept-details-page";
import {InstantieDetailsPage} from "./pages/instantie-details-page";
import {v4 as uuid} from "uuid";
import Papa from "papaparse";
import * as path from "path";
import {wait} from "./shared/shared";
import {pepingenId} from "../test-api/test-helpers/login";
import {InstanceStatus} from "../test-api/test-helpers/codelists";
import {VerzendNaarVlaamseOverheidModal} from "./modals/verzend-naar-vlaamse-overheid-modal";
import {IpdcStub} from "./components/ipdc-stub";
import {WijzigingenBewarenModal} from "./modals/wijzigingen-bewaren-modal";

test.describe.configure({mode: 'parallel'});

test.describe('Reporting dashboard', () => {

    let page: Page;
    let mockLoginPage: MockLoginPage;
    let homePage: LpdcHomePage;
    let toevoegenPage: ProductOfDienstToevoegenPage;
    let conceptDetailsPage: ConceptDetailsPage;
    let instantieDetailsPage: InstantieDetailsPage;
    let verzendNaarVlaamseOverheidModal: VerzendNaarVlaamseOverheidModal;
    let wijzigingenBewarenModel: WijzigingenBewarenModal;

    test.beforeEach(async ({browser}) => {
        page = await browser.newPage();
        mockLoginPage = MockLoginPage.createForLpdc(page);
        homePage = LpdcHomePage.create(page);
        toevoegenPage = ProductOfDienstToevoegenPage.create(page);
        conceptDetailsPage = ConceptDetailsPage.create(page);
        instantieDetailsPage = InstantieDetailsPage.create(page);
        verzendNaarVlaamseOverheidModal = VerzendNaarVlaamseOverheidModal.create(page);
        wijzigingenBewarenModel = WijzigingenBewarenModal.create(page);
    })

    test('Generate and view lpdcConceptsReport', async ({request}) => {
        let instanceIri: string | undefined = undefined;
        page.on('request', request => {
            if (request.method() === 'GET'
                && request.url().startsWith(`${lpdcUrl}/lpdc-management/public-services/`)
                && request.url().includes(`/form/`)
            ) {
                instanceIri = extractIriFromURL(request.url());
            }
        });

        await mockLoginPage.goto();
        await mockLoginPage.searchInput.fill('Pepingen');
        await mockLoginPage.login('Gemeente Pepingen');

        await homePage.expectToBeVisible();

        const uJeModal = UJeModal.create(page);
        await uJeModal.expectToBeVisible();
        await uJeModal.laterKiezenButton.click();
        await uJeModal.expectToBeClosed();

        await homePage.productOfDienstToevoegenButton.click();

        await toevoegenPage.expectToBeVisible();
        await toevoegenPage.searchConcept('Akte van Belgische nationaliteit');
        await toevoegenPage.resultTable.row(first_row).link('Akte van Belgische nationaliteit').click();

        await conceptDetailsPage.expectToBeVisible();
        await expect(conceptDetailsPage.heading).toHaveText('Concept: Akte van Belgische nationaliteit - nl');
        await conceptDetailsPage.voegToeButton.click();

        await instantieDetailsPage.expectToBeVisible();
        const titel = await instantieDetailsPage.titelInput.inputValue();
        const newTitel = titel + uuid();
        await instantieDetailsPage.titelInput.fill(newTitel);
        await instantieDetailsPage.titelInput.blur();
        await instantieDetailsPage.wijzigingenBewarenButton.click();
        await expect(instantieDetailsPage.wijzigingenBewarenButton).toBeDisabled();

        // generate report
        const filePath = await generateReportManually(request, 'lpdcConceptsReport');
        const reportCsv = fs.readFileSync(filePath, "utf8");
        const report = Papa.parse(reportCsv, { header: true });

        const row = report.data.find(instance => instance.uriPublicService === instanceIri)
        expect(row).toBeDefined();
        expect(row.uriPublicService).toEqual(instanceIri);
        expect(row.uriBestuurseenheid).toEqual(`http://data.lblod.info/id/bestuurseenheden/${pepingenId}`);
        expect(row.naam).toEqual("Pepingen");
        expect(row.statusLabel).toEqual("Ontwerp");
        expect(row.status).toEqual(InstanceStatus.ontwerp);
        expect(row.concept).toEqual("https://ipdc.tni-vlaanderen.be/id/concept/705d401c-1a41-4802-a863-b22499f71b84");
    });

    test('Generate and view lpdcBestuurseenheidReport', async ({request}) => {
        //TODO LPDC-671: 1/ navigate to pepingen, and use a concept (create instance) 2/ manually trigger report generation for this report 3/ navigate to dashboard, and download latest report for this type 4/ validate contents
    });

    test('Generate and view instancesStuckinPublishingForLPDCReport', async ({request}) => {
        let instanceIri: string | undefined = undefined;
        page.on('request', request => {
            if (request.method() === 'GET'
                && request.url().startsWith(`${lpdcUrl}/lpdc-management/public-services/`)
                && request.url().includes(`/form/`)
            ) {
                instanceIri = extractIriFromURL(request.url());
            }
        });

        await mockLoginPage.goto();
        await mockLoginPage.searchInput.fill('Pepingen');
        await mockLoginPage.login('Gemeente Pepingen');

        await homePage.expectToBeVisible();

        const uJeModal = UJeModal.create(page);
        await uJeModal.expectToBeVisible();
        await uJeModal.laterKiezenButton.click();
        await uJeModal.expectToBeClosed();

        await homePage.productOfDienstToevoegenButton.click();

        await toevoegenPage.expectToBeVisible();
        await toevoegenPage.searchConcept('Akte van Belgische nationaliteit');
        await toevoegenPage.resultTable.row(first_row).link('Akte van Belgische nationaliteit').click();

        await conceptDetailsPage.expectToBeVisible();
        await expect(conceptDetailsPage.heading).toHaveText('Concept: Akte van Belgische nationaliteit - nl');
        await conceptDetailsPage.voegToeButton.click();

        await instantieDetailsPage.expectToBeVisible();
        const titel = await instantieDetailsPage.titelInput.inputValue();
        const newTitel = titel + uuid();
        await instantieDetailsPage.titelInput.fill(newTitel);
        await instantieDetailsPage.titelInput.blur();

        await instantieDetailsPage.eigenschappenTab.click();
        await wijzigingenBewarenModel.expectToBeVisible();
        await wijzigingenBewarenModel.bewaarButton.click();
        await instantieDetailsPage.bevoegdeOverheidMultiSelect.selectValue('Pepingen (Gemeente)');

        await IpdcStub.publishShouldFail(instanceIri, 400, {message: "something went wrong"});
        await instantieDetailsPage.verzendNaarVlaamseOverheidButton.click();

        await verzendNaarVlaamseOverheidModal.expectToBeVisible();
        await verzendNaarVlaamseOverheidModal.verzendNaarVlaamseOverheidButton.click();
        await verzendNaarVlaamseOverheidModal.expectToBeClosed();
        await homePage.expectToBeVisible();

        // generate report
        const filePath = await generateReportManually(request, 'instancesStuckinPublishingForLPDCReport');
        const reportCsv = fs.readFileSync(filePath, "utf8");
        const report = Papa.parse(reportCsv, { header: true });
        const row = report.data.find(instance => instance.publicService === instanceIri)
        expect(row).toBeDefined();
        expect(row.publicService).toEqual(instanceIri);
        expect(row.type).toEqual('http://purl.org/vocab/cpsv#PublicService');
        expect(row.title).toEqual(newTitel);
        expect(row.bestuurseenheidLabel).toEqual('Pepingen');
        expect(row.classificatieLabel).toEqual('Gemeente');
        // TODO: LPDC-909: verify new fields, errorMessage, dateSent, datePublished
        // TODO: LPDC-909: Add test for tombstone
    });

});

async function generateReportManually(request: APIRequestContext, reportName: string) {
    const fileDir = './data-tests/files/';
    const filesToRemove = fs.readdirSync(fileDir);
    filesToRemove.forEach(file => fs.unlinkSync(path.join(fileDir, file)));
    await request.post(`${reportGenerationUrl}/reports`, {
        data: {
            data: {
                attributes: {
                    reportName: reportName
                }
            }
        }
    });
    const fileName = await readFileWithRetry(fileDir);
    return path.join(fileDir, fileName)
}

function extractIriFromURL(url: string): string {
    const decodedURL = decodeURIComponent(url);
    const startIri = decodedURL.indexOf('http://data.lblod.info/id/public-service/');
    const endIri = decodedURL.indexOf("/form/", startIri);
    return decodedURL.substring(startIri, endIri);
}

async function readFileWithRetry(fileDir: string): Promise<string> {
    const maxAttempts = 30;
    for (let i = 0; i < maxAttempts; i++) {
        const files = fs.readdirSync(fileDir);
        if (files.length) {
            return files[0];
        }
        await wait(1000);
    }
}