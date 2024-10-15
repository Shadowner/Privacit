export interface SentimentAnalysisResult {
    sentiment: {

        label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
        score: number;
    },
    emotion: {
        label: "joy" | "sadness" | "anger" | "fear" | "surprise" | "disgust" | "love" ;
        score: number;
    }
}