import { injectFactChecker } from "./core/FactChecker";
import { TwitterModule } from "./Modules/Twitter";
import { YTBModule } from "./Modules/Youtube";

console.log("Content script is running");

async function extractPageElements() {
	const toFilter = await chrome.storage.sync.get(["filterList"]);

	// Test If x.com;
	if (window.location.href.includes("x.com")) {
		const tweets = TwitterModule.extractElement();
		TwitterModule.filterTweets(toFilter.filterList, tweets);
		chrome.runtime.sendMessage({ action: "processedData", data: tweets });
		return;
	}
	// test if youtube.com
	if (window.location.href.includes("youtube.com")) {
		console.log("youtube.com");
		const ytbs = YTBModule.extractElement();
		console.log(ytbs);
		YTBModule.filterYtbs(toFilter.filterList, ytbs);
		chrome.runtime.sendMessage({ action: "processedData", data: ytbs });
		return;
	}

	// Envoyer les données au service worker
}

// Fonction pour observer les changements dans le DOM
function observeDOM() {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === "childList") {
				extractPageElements();
			}
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
}

window.addEventListener("load", () => {
	extractPageElements();
	observeDOM();
	injectFactChecker();
	console.log("Content script is loaded");
});

// Exécuter également lors du défilement pour capturer les nouveaux tweets chargés dynamiquement
window.addEventListener("scroll", extractPageElements);
