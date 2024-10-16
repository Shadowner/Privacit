import { PageContent } from "../interfaces/ContentData";

export class Rephraser {
    private static hashOriginal: Record<number, string> = {};
    private static processing: Set<number> = new Set();
    private static cache: Record<number, string> = {};

    public static async rephrase(text: string, constraint: string[]): Promise<string> {
        return new Promise((res) => {
            chrome.runtime.sendMessage({ type: "rephrase", data: { phrase: text, constraint } }, async (response) => {
                console.log("Response from chrome - Rephrase : ", response);
                res(response);
            });
        });
    }

    public static async rephraseContent(content: PageContent, filterList: string[]) {
        if (this.processing.has(content.smartHash)) {
            return;
        }
        this.processing.add(content.smartHash);

        if (this.cache[content.smartHash]) {
            content.text = this.cache[content.smartHash];
            content.textElement.innerHTML = content.text;
            content.textElement.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
            this.processing.delete(content.smartHash);
            return;
        }

        this.hashOriginal[content.smartHash] = content.text;
        const rephrased = await this.rephrase(content.text, filterList);
        console.log("Rephrased : ", rephrased);
        this.cache[content.smartHash] = rephrased;
        content.textElement.innerHTML = rephrased;
        content.textElement.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
        content.textElement.title = "Original : " + content.text;
        this.processing.delete(content.smartHash);
    }

    public static GetOriginalText(hash: number): string {
        return this.hashOriginal[hash];
    }


}