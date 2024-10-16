import { PageContent } from "../interfaces/ContentData";
import { SentimentAnalysisResult } from "../interfaces/SentimentAnalysis";

export class SentimentAnalysis {
    private static cache: Record<number, SentimentAnalysisResult> = {};
    private static processing: Set<number> = new Set();
    public static async PageContentSentimentAnalysis(content: PageContent) {
        if (this.processing.has(content.smartHash)) {
            console
            return;
        }
        this.processing.add(content.smartHash);
        const potentialPText = document.getElementById("SentimentPText-" + content.smartHash);
        if (potentialPText) {
            return;
        }

        const sentiment = this.cache[content.smartHash] != null ? this.cache[content.smartHash] : await SentimentAnalysis.analyze(content.text);
        this.cache[content.smartHash] = sentiment;
        console.log(this.cache);

        // sentiment is bg color, emotion is border color 
        // content.element.style.backgroundColor = sentiment.sentiment.label === "POSITIVE" ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";

        // content.element.style.borderWidth = "5px";
        // content.element.style.borderStyle = "solid";
        let SentimentPText = document.createElement("p");
        switch (sentiment.emotion.label) {
            case "joy":
                SentimentPText.innerText = "Joy";
                content.element.style.borderColor = "rgba(255, 255, 0, 0.5)";
                break;
            case "sadness":
                SentimentPText.innerText = "Sadness";
                content.element.style.borderColor = "rgba(0, 0, 255, 0.5)";
                break;
            case "anger":
                SentimentPText.innerText = "Anger";
                content.element.style.borderColor = "rgba(255, 0, 0, 0.5)";
                break;
            case "fear":
                SentimentPText.innerText = "Fear";
                content.element.style.borderColor = "rgba(0, 0, 0, 0.5)";
                break;
            case "surprise":
                SentimentPText.innerText = "Surprise";
                content.element.style.borderColor = "rgba(255, 0, 255, 0.5)";
                break;
            case "disgust":
                SentimentPText.innerText = "Disgust";
                content.element.style.borderColor = "rgba(0, 255, 255, 0.5)";
                break;
            case "love":
                SentimentPText.innerText = "Love";
                content.element.style.borderColor = "rgba(255, 0, 0, 0.5)";
                break;
            default:
                break
        }
        // SentimentPText.id = "SentimentPText-" + content.smartHash;
        // SentimentPText.style.textAlign = "center";
        // SentimentPText.style.fontWeight = "bold";
        SentimentPText.style.fontSize = "15px";
        SentimentPText.innerText += " - " + sentiment.sentiment.label;
        content.element.appendChild(SentimentPText);
        this.processing.delete(content.smartHash);
    }

    public static async analyze(text: string): Promise<SentimentAnalysisResult> {
        return new Promise((res, rej) => {
            chrome.runtime.sendMessage({ type: "sentimentAnalysis", data: text }, async (response) => {
                console.log("Response from chrome", response);
                res(await response);
            });
        });
    }
}