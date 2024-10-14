// background.js (Service Worker)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("Message reçu:", request);
	if (request.action === "processData") {
		// Traitement des données reçues
		const processedData = request.data.map((title: string) =>
			title.toUpperCase(),
		);
		console.log("Titres traités:", processedData);

		// Vous pouvez effectuer d'autres actions ici, comme stocker les données
		// ou les envoyer à un serveur
	}
});

chrome.runtime.onConnect.addListener((port) => {
	console.log("Port connecté:", port);
	port.onMessage.addListener((msg) => {
		console.log("Message reçu par le port:", msg);
	});
	port.postMessage("Message envoyé par le port");
});

console.log("Background script is running");
