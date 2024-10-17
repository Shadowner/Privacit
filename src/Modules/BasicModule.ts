import type { PageContent } from "../interfaces/ContentData";
import type { BaseContentSeeking } from "../interfaces/BaseContentSeeking";
import { hashString } from "../helper/hashString";
import { addToAd } from "../core/AdBlocker";
import { FactCheckContent, wrapTextWithFactCheck } from "../core/FactChecker";
import { SentimentAnalysis } from "../core/SentimentAnalysis";
import { Rephraser } from "../core/Rephraser";
import { filterList, options } from "../content";

export class BasicModule {
    public static ToSeekcontent: BaseContentSeeking[] = [];

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

    public static filterContent(content: PageContent[]) {
        for (const element of content) {
            this.filterElement(element);
        }
    }

    public static filterElement(element: PageContent) {

        const textElement = element.element.querySelector(this.CurrentSeekContent?.textSelector ?? "");


        if (this.CurrentSeekContent?.adSeeker != null) {
            if (this.CurrentSeekContent.adSeeker(element)) {
                addToAd(element);
                return;
            }
        }

        console.log("Filter list is", filterList);
        console.log("Options is ", options);

        if (options.filterAction == "paraphrase") {
            if (this.CurrentSeekContent?.rephrase != null && this.CurrentSeekContent.rephrase) {
                // If include any filterList, rephrase the content
                for (const filter of filterList) {
                    if (element.text.toLowerCase().includes(filter.toLowerCase())) {
                         console.log("Paraphrase");
                        Rephraser.rephraseContent(element, filterList);
                        return;
                    }
                }
            }
        } else if (options.filterAction == "delete") {
            for (const filter of filterList) {
                if (element.text.toLowerCase().includes(filter.toLowerCase())) {
                    element.element.remove();
                }
            }
            return
        }

        if (options.factCheckingEnabled) {
            if (this.CurrentSeekContent?.factCheck != null) {

                if (this.CurrentSeekContent.factCheck && textElement instanceof HTMLElement) {
                    FactCheckContent(element);
                }
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

chrome.runtime.sendMessage({ type: "getContentSeeking" }, (response) => {
    console.log("Content seeking received", response);
    BasicModule.ToSeekcontent = response;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "setContentSeeking") {
        console.log("Content seeking received - setContentSeeking", request.data);
        BasicModule.ToSeekcontent = request.data;
    }
});