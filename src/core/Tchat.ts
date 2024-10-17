import type { TchatAi } from "../interfaces/TchatAi";

export class Tchat {
    public static previousMessages: TchatAi[] = [];

    public static async postUserMessageToTchatAi(userText: string) {
        const tchatAi: TchatAi = {
            role: "user",
            content: userText
        }

        this.previousMessages.push(tchatAi);

        const res = await this.sendToAi(this.previousMessages);
        this.previousMessages.push(res);
        return res;
    }

    public static async sendToAi(text: TchatAi[]): Promise<TchatAi> {
        return new Promise((res, rej) => {
            chrome.runtime.sendMessage({ type: "tchatAi", data: text }, async (response) => {
                console.log("Response from chrome", response);
                res(response);
            });
        });
    }

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message DEPUIS CHROME:", request);
    if (request.type === "setConversation") {
        request.data.shift();
        Tchat.previousMessages = request.data;
        console.log("Conversation set", Tchat.previousMessages);
    }
});
chrome.runtime.sendMessage({ type: "getConversation" });


/*        
    return new Promise((res, rej) => {
            chrome.runtime.sendMessage({ type: "sentimentAnalysis", data: text }, async (response) => {
                console.log("Response from chrome", response);
                res(await response);
            });
        }); 
*/