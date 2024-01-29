import {v4 as uuid} from 'uuid';
import {insertTriples} from "./sparql";
import {Language} from "./language";
import {Literal, Predicates, Triple, TripleArray, Uri} from "./triple-array";
import {
    CompetentAuthorityLevel,
    ExecutingAuthorityLevel,
    InstancePublicationStatusType,
    InstanceStatus,
    ProductType,
    PublicationMedium,
    ResourceLanguage,
    ReviewStatus,
    TargetAudience,
    Theme,
    YourEuropeCategory
} from "./codelists";
import {pepingenId} from "./login";

export const PublicServiceType = 'http://purl.org/vocab/cpsv#PublicService';
export const TombstoneType = 'https://www.w3.org/ns/activitystreams#Tombstone';
export class PublicServiceTestBuilder {

    private id = new Uri(`http://data.lblod.info/id/public-service/${uuid()}`);
    private type: Uri;
    private uuid: Literal;
    private titles: Literal[] = [];
    private description: Literal;
    private additionalDescription: Literal;
    private exception: Literal;
    private regulation: Literal;
    private theme: Uri;
    private targetAudience: Uri;
    private competentAuthorityLevel: Uri;
    private executingAuthorityLevel: Uri;
    private resourceLanguage: Uri;
    private keywords: Literal[] = [];
    private productType: Uri;
    private created: Literal;
    private modified: Literal;
    private startDate: Literal;
    private endDate: Literal;
    private yourEuropeCategory: Uri;
    private publicationMedium: Uri;
    private requirement: Uri;
    private procedure: Uri;
    private moreInfo: Uri;
    private cost: Uri;
    private financialAdvantage: Uri;
    private contactPoints: Uri[] = [];
    private spatial: Uri;
    private competentAuthority: Uri[] = [];
    private executingAuthority: Uri[] = [];
    private concept: Uri;
    private createdBy: Uri;
    private versionedSource: Uri;
    private reviewStatus: Uri;
    private instanceStatus: Uri;
    private publicationStatus: Uri;

    static aPublicService() {
        return new PublicServiceTestBuilder()
            .withType()
            .withUUID(uuid())
            .withTitle('Instance title', Language.NL)
            .withDescription('Instance description', Language.NL)
            .withCreated(new Date())
            .withModified(new Date())
            .withStartDate(new Date())
            .withEndDate(new Date())
            .withInstanceStatus(InstanceStatus.ontwerp)
    }

    static aFullPublicService() {
        return new PublicServiceTestBuilder()
            .withType()
            .withUUID(uuid())
            .withTitle('Instance title', Language.NL)
            .withDescription('Instance description', Language.NL)
            .withCreated(new Date())
            .withModified(new Date())
            .withStartDate(new Date())
            .withEndDate(new Date())
            .withAdditionalDescriptions('Additional description', Language.NL)
            .withException('exception', Language.NL)
            .withRegulation('regulation', Language.NL)
            .withTheme(Theme.BurgerOverheid)
            .withTargetAudience(TargetAudience.Onderneming)
            .withCompetentAuthorityLevel(CompetentAuthorityLevel.Europees)
            .withExecutingAuthorityLevel(ExecutingAuthorityLevel.Lokaal)
            .withLanguage(ResourceLanguage.NLD)
            .withKeywords(['Keyword1', 'keyword2'])
            .withProductType(ProductType.Bewijs)
            .withYourEuropeCategory(YourEuropeCategory.Bedrijf)
            .withPublicationMedium(PublicationMedium.YourEurope)
            .withReviewStatus(ReviewStatus.conceptUpdated)
            .withSpatial(new Uri('http://vocab.belgif.be/auth/refnis2019/24001'))
            .withCompetentAuthority([new Uri(`http://data.lblod.info/id/bestuurseenheden/${pepingenId}`)])
            .withExecutingAuthority([new Uri(`http://data.lblod.info/id/bestuurseenheden/${pepingenId}`)])
            .withInstanceStatus(InstanceStatus.ontwerp)
            .withPublicationStatus(InstancePublicationStatusType.teHerpubliceren)
    }

    private withType() {
        this.type =  new Uri(PublicServiceType);
        return this;
    }

    withUUID(uuid: string): PublicServiceTestBuilder {
        this.uuid = new Literal(uuid);
        return this;
    }

    withTitle(title: string, language: Language) {
        this.titles = [new Literal(title, language)];
        return this;
    }

    withTitles(titles: {value: string, language: Language}[]) {
        this.titles = titles.map(title => new Literal(title.value, title.language));
        return this;
    }

    withNoTitle() {
        this.titles = [];
        return this;
    }

    withDescription(description: string, language: Language) {
        this.description = new Literal(description, language);
        return this;
    }

    withNoDescription() {
        this.description = undefined;
        return this;
    }

    withAdditionalDescriptions(additionalDescription: string, language: Language) {
        this.additionalDescription = new Literal(additionalDescription, language);
        return this;
    }

    withException(exception: string, language: Language) {
        this.exception = new Literal(exception, language);
        return this;
    }

    withRegulation(regulation: string, language: Language) {
        this.regulation = new Literal(regulation, language);
        return this;
    }

    withTheme(theme: Theme) {
        this.theme = new Uri(theme);
        return this;
    }

    withTargetAudience(targetAudience: TargetAudience) {
        this.targetAudience = new Uri(targetAudience);
        return this;
    }

    withCompetentAuthorityLevel(competentAuthorityLevel: CompetentAuthorityLevel) {
        this.competentAuthorityLevel = new Uri(competentAuthorityLevel);
        return this;
    }

    withExecutingAuthorityLevel(executingAuthorityLevel: ExecutingAuthorityLevel) {
        this.executingAuthorityLevel = new Uri(executingAuthorityLevel);
        return this;
    }

    withLanguage(language: ResourceLanguage) {
        this.resourceLanguage = new Uri(language);
        return this;
    }

    withKeywords(keywords: string[]) {
        this.keywords = keywords.map(keyword => new Literal(keyword, Language.NL))
        return this;
    }

    withProductType(productType: ProductType) {
        this.productType = new Uri(productType);
        return this;
    }

    withCreated(date: Date) {
        this.created = new Literal(date.toISOString(), undefined, 'http://www.w3.org/2001/XMLSchema#dateTime');
        return this;
    }

    withModified(date: Date) {
        this.modified = new Literal(date.toISOString(), undefined, 'http://www.w3.org/2001/XMLSchema#dateTime');
        return this;
    }

    withStartDate(date: Date) {
        this.startDate = new Literal(date.toISOString(), undefined, 'http://www.w3.org/2001/XMLSchema#dateTime');
        return this;
    }

    withEndDate(date: Date) {
        this.endDate = new Literal(date.toISOString(), undefined, 'http://www.w3.org/2001/XMLSchema#dateTime');
        return this;
    }

    withYourEuropeCategory(yourEuropeCategory: YourEuropeCategory) {
        this.yourEuropeCategory = new Uri(yourEuropeCategory);
        return this;
    }

    withPublicationMedium(publicationMedium: PublicationMedium) {
        this.publicationMedium = new Uri(publicationMedium);
        return this;
    }

    withNoPublicationMedium() {
        this.publicationMedium = undefined;
        return this;
    }

    withRequirement(requirementUri: Uri) {
        this.requirement = requirementUri;
        return this;
    }

    withProcedure(procedureUri: Uri) {
        this.procedure = procedureUri;
        return this;
    }

    withMoreInfo(websiteUri: Uri) {
        this.moreInfo = websiteUri;
        return this;
    }

    withCost(costUri: Uri) {
        this.cost = costUri;
        return this;
    }

    withFinancialAdvantage(financialAdvantageUri: Uri) {
        this.financialAdvantage = financialAdvantageUri;
        return this;
    }

    withContactPoint(contactPointUri: Uri) {
        this.contactPoints = [contactPointUri];
        return this;
    }

    withContactPoints(contactPointUris: Uri[]) {
        this.contactPoints = contactPointUris;
        return this;
    }

    withSpatial(geografischToepassingsGebied: Uri) {
        this.spatial = geografischToepassingsGebied;
        return this;
    }

    withCompetentAuthority(competentAuthority: Uri[]) {
        this.competentAuthority = competentAuthority;
        return this;
    }

    withExecutingAuthority(executingAuthority: Uri[]) {
        this.executingAuthority = executingAuthority;
        return this;
    }

    withLinkedConcept(concept: Uri) {
        this.concept = concept;
        return this;
    }

    withVersionedSource(conceptSnapshot: Uri) {
        this.versionedSource = conceptSnapshot;
        return this;
    }

    withCreatedBy(bestuurseenheidId: string){
        this.createdBy = new Uri(`http://data.lblod.info/id/bestuurseenheden/${bestuurseenheidId}`);
        return this;
    }

    withReviewStatus(reviewStatus: ReviewStatus) {
        this.reviewStatus = new Uri(reviewStatus);
        return this;
    }

    withInstanceStatus(instanceStatus: InstanceStatus) {
        this.instanceStatus = new Uri(instanceStatus);
        return this;
    }
    withPublicationStatus(publicationStatus: InstancePublicationStatusType){
        this.publicationStatus = new Uri(publicationStatus)
        return this;
    }


    private buildTripleArray(organisationId: string): TripleArray {
        if(!this.createdBy) {
            this.withCreatedBy(organisationId);
        }
        const triples = [
            new Triple(this.id, Predicates.type, this.type),
            new Triple(this.id, Predicates.uuid, this.uuid),
            ...this.titles.map(title => new Triple(this.id, Predicates.title, title)),
            new Triple(this.id, Predicates.description, this.description),
            new Triple(this.id, Predicates.additionalDescription, this.additionalDescription),
            new Triple(this.id, Predicates.exception, this.exception),
            new Triple(this.id, Predicates.regulation, this.regulation),
            new Triple(this.id, Predicates.thematicArea, this.theme),
            new Triple(this.id, Predicates.targetAudience, this.targetAudience),
            new Triple(this.id, Predicates.competentAuthorityLevel, this.competentAuthorityLevel),
            new Triple(this.id, Predicates.executingAuthorityLevel, this.executingAuthorityLevel),
            new Triple(this.id, Predicates.language, this.resourceLanguage),
            ...this.keywords.map(keyword => new Triple(this.id, Predicates.keyword, keyword)),
            new Triple(this.id, Predicates.productType, this.productType),
            new Triple(this.id, Predicates.created, this.created),
            new Triple(this.id, Predicates.modified, this.modified),
            new Triple(this.id, Predicates.startDate, this.startDate),
            new Triple(this.id, Predicates.endDate, this.endDate),
            new Triple(this.id, Predicates.yourEuropeCategory, this.yourEuropeCategory),
            new Triple(this.id, Predicates.publicationMedium, this.publicationMedium),
            new Triple(this.id, Predicates.hasRequirement, this.requirement),
            new Triple(this.id, Predicates.hasProcedure, this.procedure),
            new Triple(this.id, Predicates.hasMoreInfo, this.moreInfo),
            new Triple(this.id, Predicates.hasCost, this.cost),
            new Triple(this.id, Predicates.hasFinancialAdvantage, this.financialAdvantage),
            ...this.contactPoints.map(contactPoint => new Triple(this.id, Predicates.hasContactPoint, contactPoint)),
            new Triple(this.id, Predicates.spatial, this.spatial),
            ...this.competentAuthority.map(aCompetentAuthority => new Triple(this.id, Predicates.hasCompetentAuthority, aCompetentAuthority)),
            ...this.executingAuthority.map(anExecutingAuthority => new Triple(this.id, Predicates.hasExecutingAuthority, anExecutingAuthority)),
            new Triple(this.id, Predicates.source, this.concept),
            new Triple(this.id, Predicates.createdBy, this.createdBy),
            new Triple(this.id, Predicates.hasVersionedSource, this.versionedSource),
            new Triple(this.id, Predicates.reviewStatus, this.reviewStatus),
            new Triple(this.id, Predicates.instanceStatus, this.instanceStatus),
            new Triple(this.id, Predicates.publicationStatus, this.publicationStatus)
        ];
        return new TripleArray(triples);
    }

    async buildAndPersist(request, organisationId: string): Promise<TripleArray> {
        const publicService = this.buildTripleArray(organisationId);
        await insertTriples(request, `http://mu.semte.ch/graphs/organizations/${organisationId}/LoketLB-LPDCGebruiker`, publicService.asStringArray());
        return publicService;
    }
}
