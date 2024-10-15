import { SentimentAnalysisResult } from "../../interfaces/SentimentAnalysis";
import { MainSocket } from "./SocketConnection";


export class AiServerAction {
    public static async RequestSentimentAnalysis(text: string): Promise<SentimentAnalysisResult> {
        console.log("Requesting sentiment analysis");
        return await MainSocket.sendMessage<SentimentAnalysisResult>({
            type: "sentimentAnalysis",
            data: text,
        })
    }

    public static async RequestRephrase(text: string, instructions: any) {
        return await MainSocket.sendMessage<string>({
            type: "rephrase",
            data: text,
            instructions
        })
    }

    public static async RequestFactChecking(text: string) {
        return await MainSocket.sendMessage<string>({
            type: "factCheck",
            data: text
        })
    }
}