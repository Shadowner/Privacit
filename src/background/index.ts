// background.js (Service Worker)

import { AiServerAction } from "../core/worker/AiServerAction";
import { MainSocket } from "../core/worker/SocketConnection";
import { contentSeeking, conversation, filterList, globalOptions } from "../storage";
export const sentimentalSocket = new MainSocket()
export const factRephraserSocket = new MainSocket()
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
        console.log("Sentiment Analysis Requested");
        const analysis = AiServerAction.RequestSentimentAnalysis(request.data).then((res) => {
            //@ts-ignore
            sendResponse(res.data);
        });
        return true;
    }

    if (request.type === "factCheck") {
        console.log("Fact Checking Request");
        const analysis = AiServerAction.RequestFactChecking(request.data).then((res) => {
            //@ts-ignore
            sendResponse(res.data);
        });
        return true;
    }

    if (request.type === "rephrase") {
        console.log("Rephrasing Request");
        const analysis = AiServerAction.RequestRephrase(request.data.phrase, request.data.constraint).then((res) => {
            //@ts-ignore
            sendResponse(res.data);
        });
        return true;
    }

    if (request.type === "tchatAi") {
        console.log("Tchat Ai Request");
        const analysis = AiServerAction.RequestTchatAi(request.data).then((res) => {
            //@ts-ignore
            sendResponse(res.data);
        });
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
            console.log("Options From storage - ", res);
            sendResponse(res);
            chrome.runtime.sendMessage({ type: "setOptions", data: res });
        });
        return true;
    }

    if (request.type === "getConversation") {
        conversation.GetValueFromChromeStorage().then((res) => {
            chrome.runtime.sendMessage({ type: "setConversation", data: res });
        });
    }

    if (request.type === "getContentSeeking") {
        contentSeeking.GetValueFromChromeStorage().then((res) => {
            sendResponse(res);
            chrome.runtime.sendMessage({ type: "setContentSeeking", data: res });
        });
        return true;
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

contentSeeking.subscribe((value) => {
    chrome.runtime.sendMessage({ type: "setContentSeeking", data: value });
});

console.log("Background script is running");


/*
chrome.runtime.sendMessage({ type: "getContentSeeking" }, (response) => {
    console.log("Content seeking received", response);
    BasicModule.ToSeekcontent = response;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "setContentSeeking") {
        console.log("Content seeking received - setContentSeeking", request.data);
        BasicModule.ToSeekcontent = request.data;
    }
});*/