import { PageContent } from "./ContentData";

export interface BaseContentSeeking {
    url: string;
    parentSelector: string;
    textSelector: string;
    factCheck?: boolean;
    uniqueIdentifierSelector?: string;
    sentimentAnalysis?: boolean;
    rephrase?: boolean;
    adSeeker?: (content: PageContent) => boolean;
}