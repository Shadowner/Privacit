import { wrapTextWithFactCheck } from "../core/FactChecker";
import { SentimentAnalysis } from "../core/SentimentAnalysis";
import { hashString } from "../helper/hashString";
import { PageContent } from "../interfaces/ContentData";
export class YTBModule {
    private static markedSponsorised: number[] = [];
    private static factedTweets: number[] = [];
    private static seenContents: number[] = [];

    public static extractElement(): PageContent[] {
        // <div id="body" class="ytd-comment-view-model">
        const ytb = document.querySelectorAll("div[id='body'].ytd-comment-view-model");
        if (!ytb) {
            return [];
        }

        const YTBS: PageContent[] = [];
        for (const element of ytb) {
            if (!(element instanceof HTMLElement)) {
                continue;
            }

            const ytbText = element.querySelector('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap')?.textContent ?? "";
            const hash = hashString(ytbText);
            const tweet: PageContent = {
                smartHash: hash,
                ariaId: ytbText,
                text: ytbText,
                element,
            };
            YTBS.push(tweet);
        }

        return YTBS;
    }

    public static async filterYtbs(
        filterList: string[],
        ytbs: PageContent[],
    ) {
        for (const ytb of ytbs) {
            this.filterYtb(filterList, ytb);
        }
    }

    public static async filterYtb(filterList: string[], ytb: PageContent) {
        if (filterList.length === 0) {
            console.log("No filter list provided");
            return;
        }

        //TODO: Remove this code
        // const text = tweet.text;
        // if (filterList.some((filter) => text.includes(filter))) {
        //     tweet.element.style.display = "none";
        // }

        if (
            ytb.element.textContent?.includes("Sponsorisé") &&
            !YTBModule.markedSponsorised.includes(ytb.smartHash)
        ) {
            YTBModule.markedSponsorised.push(ytb.smartHash);
            ytb.element.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
            console.log("Marked sponsored tweet:", ytb.smartHash);
            return;
        }

        for (const sentence of filterList) {
            const ytbText = ytb.element.querySelector('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap');
            if (!(ytbText instanceof HTMLElement)) {
                return;
            }

            const regex = new RegExp(`\\b${sentence}\\b`, "gi");
            if (
                ytb.text.match(regex) &&
                !YTBModule.factedTweets.includes(ytb.smartHash)
            ) {
                wrapTextWithFactCheck(ytbText, sentence, {
                    link: "https://www.google.com",
                    message: "This is a fact-checking message",
                });

                YTBModule.factedTweets.push(ytb.smartHash);
                console.log(
                    "Applied fact-checking to tweet:",
                    `${ytb.smartHash} ${sentence}`,
                );
                return;
            }
        }
        if (this.seenContents.includes(ytb.smartHash)) {
            return
        }
        this.seenContents.push(ytb.smartHash);

        const sentiment = await SentimentAnalysis.analyze(ytb.text);
        // sentiment is bg color, emotion is border color 
        ytb.element.style.backgroundColor = sentiment.sentiment.label === "POSITIVE" ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";
        /**export interface SentimentAnalysisResult {
           sentiment: {
       
               label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
               score: number;
           },
           emotion: {
               label:  "joy" | "sadness" | "anger" | "fear" | "surprise" | "disgust" | "love" ;
               score: number;
           }
       } */
        ytb.element.style.borderWidth = "5px";
        ytb.element.style.borderStyle = "solid";
        let SentimentPText = document.createElement("p");
        switch (sentiment.emotion.label) {
            case "joy":
                SentimentPText.innerText = "Joy";
                ytb.element.style.borderColor = "rgba(255, 255, 0, 0.5)";
                break;
            case "sadness":
                SentimentPText.innerText = "Sadness";
                ytb.element.style.borderColor = "rgba(0, 0, 255, 0.5)";
                break;
            case "anger":
                SentimentPText.innerText = "Anger";
                ytb.element.style.borderColor = "rgba(255, 0, 0, 0.5)";
                break;
            case "fear":
                SentimentPText.innerText = "Fear";
                ytb.element.style.borderColor = "rgba(0, 0, 0, 0.5)";
                break;
            case "surprise":
                SentimentPText.innerText = "Surprise";
                ytb.element.style.borderColor = "rgba(255, 0, 255, 0.5)";
                break;
            case "disgust":
                SentimentPText.innerText = "Disgust";
                ytb.element.style.borderColor = "rgba(0, 255, 255, 0.5)";
                break;
            case "love":
                SentimentPText.innerText = "Love";
                ytb.element.style.borderColor = "rgba(255, 0, 0, 0.5)";
                break;
            default:
                break
        }
        SentimentPText.style.textAlign = "center";
        SentimentPText.style.fontWeight = "bold";
        SentimentPText.style.fontSize = "20px";
        SentimentPText.innerText += " - " + sentiment.sentiment.label;
        ytb.element.appendChild(SentimentPText);


    }

    public static addToAd(element: HTMLElement) {
        element.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        console.log("Marked as Ad");
    }
}
