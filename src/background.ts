// background.js (Service Worker)

import { AiServerAction } from "./core/worker/AiServerAction";
import { MainSocket } from "./core/worker/SocketConnection";

MainSocket.connect().then(async () => {
	console.log("Connected to the server");
	const res = await MainSocket.sendMessage<{ type: string }>({ type: "connected" });
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

	return true;
});

console.log("Background script is running");
