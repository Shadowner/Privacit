import { PageContent } from "../interfaces/ContentData";
import { BaseContentSeeking } from "../interfaces/BaseContentSeeking";
import { hashString } from "../helper/hashString";
import { addToAd } from "../core/AdBlocker";
import { FactCheckContent, wrapTextWithFactCheck } from "../core/FactChecker";
import { SentimentAnalysis } from "../core/SentimentAnalysis";



export class BasicModule {
    private static ToSeekcontent: BaseContentSeeking[] = [
        {
            parentSelector: "div[data-answerid]",
            textSelector: 'div[itemprop="text"]',
            url: "stackoverflow",
            sentimentAnalysis: true,
            factCheck: false
        },
        {
            parentSelector: 'article[data-testid="tweet"]',
            textSelector: 'div[data-testid="tweetText"]',
            url: "x.com",
            sentimentAnalysis: true,
            factCheck: true
        }, 
        {
            parentSelector: `div[id='body'].ytd-comment-view-model`,
            textSelector: '.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap',
            url: "youtube.com",
            sentimentAnalysis: true,
            factCheck: false
        }
    ];
    private static get CurrentSeekContent() {
        return this.ToSeekcontent.find((content) => window.location.href.includes(content.url));
    }

    private static SeenHash: number[] = [];

    public static extractElement(): PageContent[] {
        const content = this.CurrentSeekContent;
        if (!content) {
            console.log("No content found");
            return [];
        }

        const elements = document.querySelectorAll(content.parentSelector);
        if (!elements) {
            console.log("No elements found");
            return [];
        }

        const contentList: PageContent[] = [];
        for (const element of elements) {
            if (!(element instanceof HTMLElement)) {

                continue;
            }

            const textElement = element.querySelector(content.textSelector);
            const text = textElement instanceof HTMLElement
                ? textElement.textContent || ""
                : "";

            const potentialId = content.uniqueIdentifierSelector
                ? element.querySelector(content.uniqueIdentifierSelector)?.textContent || null : null;
            const contentItem: PageContent = {
                text,
                element,
                ariaId: potentialId ?? hashString(text).toString(),
                smartHash: hashString(text),
                textElement: textElement as HTMLElement
            };
            contentList.push(contentItem);
        }

        return contentList;
    }

    public static filterContent(filterList: string[], content: PageContent[]) {
        for (const element of content) {
            this.filterElement(filterList, element);
        }
    }

    public static filterElement(filterList: string[], element: PageContent) {

        const textElement = element.element.querySelector(this.CurrentSeekContent?.textSelector ?? "");
        if (filterList.length === 0) {
            console.log("No filter list provided");
            return;
        }

        // Futur: Make multiple list and type of filter

        // const filterArray = filterList.split(",");
        // for (const filter of filterArray) {
        //     if (element.text.toLowerCase().includes(filter.toLowerCase())) {
        //         element.element.remove();
        //     }
        // }

        if (this.CurrentSeekContent?.adSeeker != null) {
            if (this.CurrentSeekContent.adSeeker(element)) {
                addToAd(element);
                return;
            }
        }

        if (this.CurrentSeekContent?.factCheck != null) {

            if (this.CurrentSeekContent.factCheck && textElement instanceof HTMLElement) {
                FactCheckContent(element);
            }
        }

        if (this.CurrentSeekContent?.sentimentAnalysis != null) {
            if (this.CurrentSeekContent.sentimentAnalysis) {
                console.log("Sentiment analysis");
                SentimentAnalysis.PageContentSentimentAnalysis(element);
            }
        }
        
    }

}