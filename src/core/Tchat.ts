import type { TchatAi } from "../interfaces/TchatAi";

export class Tchat {
    private static previousMessages: TchatAi[] = [];

    public static async postUserMessageToTchatAi(userText: string) {
        const tchatAi: TchatAi = {
            role: "user",
            content: userText
        }

        this.previousMessages.push(tchatAi);

        const res = await this.sendToAi(this.previousMessages.map(t => JSON.stringify(t)));
        this.previousMessages.push(res);
        return res;
    }

    public static async sendToAi(text: string[]): Promise<TchatAi> {
        return new Promise((res, rej) => {
            chrome.runtime.sendMessage({ type: "tchatAi", data: text }, async (response) => {
                console.log("Response from chrome", response);
                res(response);
            });
        });
    }


}

/*        return new Promise((res, rej) => {
            chrome.runtime.sendMessage({ type: "sentimentAnalysis", data: text }, async (response) => {
                console.log("Response from chrome", response);
                res(await response);
            });
        }); */