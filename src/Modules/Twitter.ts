import { wrapTextWithFactCheck } from "../core/FactChecker";
import { hashString } from "../helper/hashString";
import { PageContent } from "../interfaces/ContentData";
export class TwitterModule {
    private static markedSponsorised: number[] = [];
    private static factedTweets: number[] = [];

    public static extractElement(): PageContent[] {
        const tweet = document.querySelectorAll('article[data-testid="tweet"]');
        if (!tweet) {
            return [];
        }

        const tweets: PageContent[] = [];
        for (const element of tweet) {
            if (!(element instanceof HTMLElement)) {
                continue;
            }

            const aria = element.getAttribute("aria-labelledby") || "";
            const hash = hashString(aria);
            const tweetText = element.querySelector('[data-testid="tweetText"]');
            const tweet: PageContent = {
                smartHash: hash,
                ariaId: aria,
                text: tweetText instanceof HTMLElement
                    ? tweetText.textContent || ""
                    : "",
                element,
            };
            tweets.push(tweet);
        }

        return tweets;
    }

    public static async filterTweets(
        filterList: string[],
        tweets: PageContent[],
    ) {
        for (const tweet of tweets) {
            this.filterTweet(filterList, tweet);
        }
    }

    public static filterTweet(filterList: string[], tweet: PageContent) {
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
            tweet.element.textContent?.includes("Sponsorisé") &&
            !TwitterModule.markedSponsorised.includes(tweet.smartHash)
        ) {
            TwitterModule.markedSponsorised.push(tweet.smartHash);
            tweet.element.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
            console.log("Marked sponsored tweet:", tweet.smartHash);
            return;
        }

        for (const sentence of filterList) {
            const tweetText = tweet.element.querySelector('[data-testid="tweetText"]');
            if (!(tweetText instanceof HTMLElement)) {
                return;
            }

            const regex = new RegExp(`\\b${sentence}\\b`, "gi");
            if (
                tweet.text.match(regex) &&
                !TwitterModule.factedTweets.includes(tweet.smartHash)
            ) {
                wrapTextWithFactCheck(tweetText, sentence, {
                    link: "https://www.google.com",
                    message: "This is a fact-checking message",
                });

                TwitterModule.factedTweets.push(tweet.smartHash);
                console.log(
                    "Applied fact-checking to tweet:",
                    `${tweet.smartHash} ${sentence}`,
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
