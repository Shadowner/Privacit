import { injectFactChecker } from "../core/FactChecker";
import { BasicModule } from "../Modules/BasicModule";

console.log("Content script is running");

let previousSeen: Set<number> = new Set();

async function extractPageElements() {
    const toFilter = ["enculé", "debug"];

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

    BasicModule.filterContent(toFilter, filtered);

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
    console.log("Content script is loaded");
});

// Exécuter également lors du défilement pour capturer les nouveaux tweets chargés dynamiquement
window.addEventListener("scroll", extractPageElements);
