import { injectFactChecker } from "../core/FactChecker";
import { SentimentAnalysis } from "../core/SentimentAnalysis";
import type { GlobalOptions } from "../interfaces/GlobalOptions";
import { BasicModule } from "../Modules/BasicModule";

console.log("Content script is running");

let previousSeen: Set<number> = new Set();
export let options: GlobalOptions = {
    factCheckingEnabled: true,
    filterAction: "paraphrase"
};

export let filterList: string[] = ["enculé"];

chrome.runtime.sendMessage({ type: "getFilter" }, (response) => {
    filterList = response;
});

chrome.runtime.sendMessage({ type: "getOptions" }, (response) => {
    options = response;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "setFilter") {
        filterList = request.data;
    } else if (request.type === "setOptions") {
        options = request.data;
    }
});


async function extractPageElements() {



    // // Test If x.com;
    // if (window.location.href.includes("x.com")) {
    // 	const tweets = TwitterModule.extractElement();
    // 	TwitterModule.filterTweets(toFilter.filterList, tweets);
    // 	return;
    // }
    // test if youtube.com


    const extracted = BasicModule.extractElement();

    const filtered = extracted.filter(pc => !previousSeen.has(pc.smartHash))
    previousSeen = new Set();

    BasicModule.filterContent(filtered);

    extracted.forEach(pc => previousSeen.add(pc.smartHash))

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
    SentimentAnalysis.InjectSentimentStyle();
});

// Exécuter également lors du défilement pour capturer les nouveaux tweets chargés dynamiquement
window.addEventListener("scroll", extractPageElements);
