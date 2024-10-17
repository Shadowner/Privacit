import { factRephraserSocket, sentimentalSocket } from "../../background";
import type { SentimentAnalysisResult } from "../../interfaces/SentimentAnalysis";


export class AiServerAction {
    public static async RequestSentimentAnalysis(text: string): Promise<SentimentAnalysisResult> {
        console.log("Requesting sentiment analysis");
        return await sentimentalSocket.sendMessage<SentimentAnalysisResult>({
            type: "sentimentAnalysis",
            data: text,
        })
    }

    public static async RequestRephrase(text: string, instructions: any) {
        return await factRephraserSocket.sendMessage<string>({
            type: "rephrase",
            data: text,
            instructions
        })
    }

    public static async RequestFactChecking(text: string) {
        return await factRephraserSocket.sendMessage<string>({
            type: "factCheck",
            data: text
        })
    }
}

