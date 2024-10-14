import { wrapTextWithFactCheck } from "../core/FactChecker";
import { hashString } from "../helper/hashString";
import { PageContent } from "../interfaces/ContentData";
export class YTBModule {
    private static markedSponsorised: number[] = [];
    private static factedTweets: number[] = [];

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

    public static filterYtb(filterList: string[], ytb: PageContent) {
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


    }

    public static addToAd(element: HTMLElement) {
        element.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        console.log("Marked as Ad");
    }
}
