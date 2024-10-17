import type { PageContent } from "../interfaces/ContentData";
import type { SentimentAnalysisResult } from "../interfaces/SentimentAnalysis";

export class SentimentAnalysis {
    private static cache: Record<number, SentimentAnalysisResult> = {};
    private static processing: Set<number> = new Set();

    public static InjectSentimentStyle() {
        if (document.getElementById("SentimentAnalysisStyle")) {
            return;
        }
        const styles = `
    .sentiment-pastille {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: middle;
    }

    .inner-circle {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
    }

    .emotion-text {
      font-size: 14px;
    }
  `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        styleSheet.id = "SentimentAnalysisStyle";
        document.head.appendChild(styleSheet);
    }

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

        const SentimentPText = createSentimentPastille(sentiment);

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

interface Sentiment {
    label: "POSITIVE" | "NEGATIVE";
}

interface Emotion {
    label: "joy" | "sadness" | "anger" | "fear" | "surprise" | "disgust" | "love";
}

interface ContentElement extends HTMLElement {
    smartHash?: string;
}

// Fonction pour créer la pastille
function createSentimentPastille(analysisResult: SentimentAnalysisResult): HTMLSpanElement {
    SentimentAnalysis.InjectSentimentStyle();
    const pastille = document.createElement('span');
    pastille.className = 'sentiment-pastille';

    const innerCircle = document.createElement('div');
    innerCircle.className = 'inner-circle';

    const emotionText = document.createElement('span');
    emotionText.className = 'emotion-text';
    emotionText.textContent = analysisResult.emotion.label.charAt(0).toUpperCase();

    
    innerCircle.appendChild(emotionText);
    pastille.appendChild(innerCircle);
    
    pastille.title = `Type: ${analysisResult.sentiment.label}, Emotion: ${analysisResult.emotion.label}`;


    // Appliquer les styles en fonction du sentiment et de l'émotion
    applyStyles(pastille, innerCircle, analysisResult);

    return pastille;
}

// Fonction pour appliquer les styles
function applyStyles(pastille: HTMLSpanElement, innerCircle: HTMLDivElement, analysis: SentimentAnalysisResult): void {

    // Couleur de contour basée sur le sentiment
    pastille.style.background = analysis.sentiment.label === "POSITIVE" ?
        "linear-gradient(to right, #4CAF50, #45a049)" :
        "linear-gradient(to right, #f44336, #da190b)";

    // Couleur de remplissage basée sur l'émotion
    switch (analysis.emotion.label) {
        case "joy":
            innerCircle.style.backgroundColor = "#FFC107";
            break;
        case "sadness":
            innerCircle.style.backgroundColor = "#2196F3";
            break;
        case "anger":
            innerCircle.style.backgroundColor = "#FF5722";
            break;
        case "fear":
            innerCircle.style.backgroundColor = "#607D8B";
            break;
        case "surprise":
            innerCircle.style.backgroundColor = "#E91E63";
            break;
        case "disgust":
            innerCircle.style.backgroundColor = "#00BCD4";
            break;
        case "love":
            innerCircle.style.backgroundColor = "#9C27B0";
            break;
        default:
            innerCircle.style.backgroundColor = "#9E9E9E";
    }
}

