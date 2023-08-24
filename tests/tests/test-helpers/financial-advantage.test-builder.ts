import {v4 as uuid} from 'uuid';
import {Literal, Predicates, Triple, TripleArray, Uri} from "./triple-array";
import {Language} from "./language";
import {APIRequestContext} from "@playwright/test";
import {insertTriples} from "./sparql";

export const FinancialAdvantageType = 'https://productencatalogus.data.vlaanderen.be/ns/ipdc-lpdc#FinancialAdvantage';

export class FinancialAdvantageTestBuilder {

    private id: Uri = new Uri(`http://data.lblod.info/id/financial-advantage/${uuid()}`);
    private type: Uri;
    private uuid: Literal;
    private titles: Literal[] = [];
    private descriptions: Literal[] = [];

    static aFinancialAdvantage() {
        return new FinancialAdvantageTestBuilder()
            .withType()
            .withUUID(uuid())
            .withTitles([
                {value: 'financial advantage title nl', language: Language.NL},
                {value: 'financial advantage title generated informal', language: Language.GENERATED_INFORMAL},
                {value: 'financial advantage title generated formal', language: Language.GENERATED_FORMAL},
            ])
            .withDescriptions([
                {value: 'financial advantage description nl', language: Language.NL},
                {value: 'financial advantage description generated informal', language: Language.GENERATED_INFORMAL},
                {value: 'financial advantage description generated formal', language: Language.GENERATED_FORMAL},
            ])
    }

    private withType() {
        this.type = new Uri(FinancialAdvantageType);
        return this;
    }

    withUUID(uuid: string) {
        this.uuid = new Literal(uuid);
        return this;
    }

    withTitle(title: string, language: Language) {
        this.titles = [new Literal(title, language)];
        return this;
    }

    withTitles(titles: {value: string, language: Language}[]) {
        this.titles = titles.map(item => new Literal(item.value, item.language));
        return this;
    }

    withDescription(description: string, language: Language) {
        this.descriptions = [new Literal(description, language)];
        return this;
    }

    withDescriptions(descriptions: {value: string, language: Language}[]) {
        this.descriptions = descriptions.map(item => new Literal(item.value, item.language));
        return this;
    }

    buildTripleArray(): TripleArray {
        const triples = [
            new Triple(this.id, Predicates.type, this.type),
            new Triple(this.id, Predicates.uuid, this.uuid),
            ...this.titles.map(title => new Triple(this.id, Predicates.title, title)),
            ...this.descriptions.map(description => new Triple(this.id, Predicates.description, description)),
        ];
        return new TripleArray(triples);
    }

    async buildAndPersist(request: APIRequestContext, graph = 'http://mu.semte.ch/graphs/public'): Promise<TripleArray> {
        const financialAdvantage = this.buildTripleArray();
        await insertTriples(request, graph, financialAdvantage.asStringArray());
        return financialAdvantage;
    }
}