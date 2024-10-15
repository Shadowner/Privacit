import { PageContent } from "../interfaces/ContentData";

export class Rephraser {
    private static hashOriginal: Record<number, string> = {};

    public static async rephrase(text: string): Promise<string> {

        return text;
    }

    public static async rephraseElement(element: HTMLElement) {
        if (element instanceof HTMLElement) {
            element.innerHTML = await this.rephrase(element.innerHTML);
        }
    }

    public static rephraseElements(elements: HTMLElement[]): void {
        elements.forEach((element) => this.rephraseElement(element));
    }

    public static rephraseAll(): void {
        const elements = document.querySelectorAll("body *");
        this.rephraseElements(Array.from(elements) as HTMLElement[]);
    }

    public static rephraseContent(content: PageContent): void {
        this.hashOriginal[content.smartHash] = content.text;
        this.rephraseElement(content.element);
    }

    public static GetOriginalText(hash: number): string {
        return this.hashOriginal[hash];
    }


}