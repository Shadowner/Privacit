// background.js (Service Worker)

import { AiServerAction } from "../core/worker/AiServerAction";
import { MainSocket } from "../core/worker/SocketConnection";
import { conversation, filterList, globalOptions } from "../storage";
export const sentimentalSocket = new MainSocket()
export const factRephraserSocket = new MainSocket("ws://192.168.1.198:8765")
sentimentalSocket.connect().then(async () => {
    console.log("Connected to the server");
    const res = await sentimentalSocket.sendMessage<{ type: string }>({ type: "connected" });
    console.log("Response from server", res);
});

factRephraserSocket.connect().then(async () => {
    console.log("Connected to the server");
    const res = await factRephraserSocket.sendMessage<{ type: string }>({ type: "connected" });
    console.log("Response from server", res);
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message DEPUIS CHROME:", request);
    if (request.type === "sentimentAnalysis") {
        const analysis = AiServerAction.RequestSentimentAnalysis(request.data).then((res) => {
            //@ts-ignore
            sendResponse(res.data);
        });
        console.log(analysis)
        console.log("Sentiment analysis requested");
        return true;
    }

    if (request.type === "factCheck") {
        const analysis = AiServerAction.RequestFactChecking(request.data).then((res) => {
            //@ts-ignore
            sendResponse(res.data);
        });
        console.log(analysis)
        console.log("Fact checking requested");
        return true;
    }

    if (request.type === "rephrase") {
        const analysis = AiServerAction.RequestRephrase(request.data.phrase, request.data.constraint).then((res) => {
            //@ts-ignore
            sendResponse(res.data);
        });
        console.log(analysis)
        console.log("Rephrasing requested");
        return true;
    }

    if (request.type === "tchatAi") {
        const analysis = AiServerAction.RequestTchatAi(request.data).then((res) => {
            //@ts-ignore
            sendResponse(res.data);
        });
        console.log(analysis)
        console.log("Tchat AI requested");
        return true
    }

    if (request.type === "getFilter") {
        filterList.GetValueFromChromeStorage().then((res) => {
            sendResponse(res);
        });
        return true;
    }

    if (request.type === "getOptions") {
        globalOptions.GetValueFromChromeStorage().then((res) => {
            sendResponse(res);
        });
        return true;
    }

    if (request.type === "getConversation") {
        conversation.GetValueFromChromeStorage().then((res) => {
            chrome.runtime.sendMessage({ type: "setConversation", data: res });
        });

    }

    return true;
});

filterList.subscribe((value) => {
    chrome.runtime.sendMessage({ type: "setFilter", data: value });
});

globalOptions.subscribe((value) => {
    chrome.runtime.sendMessage({ type: "setOptions", data: value });
});

conversation.subscribe((value) => {
    chrome.runtime.sendMessage({ type: "setConversation", data: value });
});

console.log("Background script is running");
