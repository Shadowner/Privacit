export interface FactCheckingResult {
    claim: string;
    explanation: string;
    confidence: number;
    search_query: string;
}