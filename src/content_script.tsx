console.log("Content script is running");

// Styles CSS pour le surlignage et le tooltip
const styles = `
.fact-check-highlight {
  border-bottom: 1px dotted #ff6b6b;
  position: relative;
  cursor: help;
}

.fact-check-tooltip {
  position: fixed;
  width: 250px;
  background-color: #f8f9fa;
  color: #333;
  text-align: left;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.15);
  font-size: 14px;
  line-height: 1.4;
  z-index: 10000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.fact-check-tooltip.visible {
  opacity: 1;
  visibility: visible;
}

.fact-check-tooltip a {
  color: #007bff;
  text-decoration: none;
}

.fact-check-tooltip a:hover {
  text-decoration: underline;
}
`;

const markedSponsorised: number[] = [];

// Injecter les styles dans la page
const styleElement = document.createElement("style");
styleElement.textContent = styles;
document.head.appendChild(styleElement);

interface Tweet {
	ariaId: string;
	smartHash: number;
	text: string;
	element: HTMLElement;
}

interface FactCheckInfo {
	message: string;
	link: string;
}

const factCheckInfo: FactCheckInfo = {
	message:
		"Cette affirmation pourrait être inexacte. Vérifiez les sources fiables pour plus d'informations.",
	link: "https://www.who.int/fr/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters",
};

// Créer un seul tooltip qui sera réutilisé
const tooltip = document.createElement("div");
tooltip.className = "fact-check-tooltip";
document.body.appendChild(tooltip);

function updateTooltipContent(message: string, link: string) {
	tooltip.innerHTML = `
        <p>${message}</p>
        <a href="${link}" target="_blank" rel="noopener noreferrer">En savoir plus</a>
    `;
}

function showTooltip(highlight: HTMLElement) {
	const rect = highlight.getBoundingClientRect();
	const tooltipHeight = tooltip.offsetHeight;
	const viewportHeight = window.innerHeight;

	let top = rect.top - tooltipHeight - 10; // 10px de marge
	if (top < 0) {
		// Pas assez d'espace au-dessus, afficher en dessous
		top = rect.bottom + 5;
	}

	console.log(rect);

	tooltip.style.left = `${rect.left}px`;
	tooltip.style.top = `${top}px`;
	tooltip.classList.add("visible");
}

function hideTooltip() {
	tooltip.classList.remove("visible");
}

function wrapTextWithFactCheck(
	element: HTMLElement,
	sentence: string,
	factCheckInfo: FactCheckInfo,
) {
	const regex = new RegExp(`\\b${sentence}\\b`, "gi");
	element.innerHTML = element.innerHTML.replace(regex, (match) => {
		const span = document.createElement("span");
		span.className = "fact-check-highlight";
		span.textContent = match;
		span.dataset.factCheckMessage = factCheckInfo.message;
		span.dataset.factCheckLink = factCheckInfo.link;
		return span.outerHTML;
	});
}

const seenSmartHash = new Set<number>();
const tweets: Omit<Tweet, "element">[] = [];
async function extractPageElements() {
	const toFilter = await chrome.storage.sync.get(["filterList"]);

	const articles = document.querySelectorAll('article[data-testid="tweet"]');
	for (const element of articles) {
		if (!(element instanceof HTMLElement)) {
			continue;
		}
		const aria = element.getAttribute("aria-labelledby") || "";
		const hash = hashString(aria);
		if (seenSmartHash.has(hash)) {
			continue;
		}

		const tweetText = element.querySelector('[data-testid="tweetText"]');
		const tweet: Tweet = {
			smartHash: hashString(aria),
			ariaId: aria,
			text: tweetText instanceof HTMLElement ? tweetText.textContent || "" : "",
			element,
		};

		// // Add a H1 with the smart hash
		// const h1 = document.createElement("h1");
		// h1.textContent = `Smart Hash${tweet.smartHash.toString()}`;
		// element.prepend(h1);
		if (!seenSmartHash.has(tweet.smartHash)) {
			tweets.push(tweet);
			seenSmartHash.add(tweet.smartHash);
			console.log(
				JSON.stringify(
					tweets.map((t) => {
						return {
							hash: t.smartHash,
							text: t.text,
						};
					}),
				),
			);
		}

		filterTweet(toFilter.filterList, tweet);
	}

	// Envoyer les données au service worker
	chrome.runtime.sendMessage({ action: "processData", data: tweets });
}

let factedTweets: number[] = [];
function filterTweet(filterList: string[], tweet: Tweet) {
	if (filterList.length === 0) {
		return;
	}

	const tweetText = tweet.element.querySelector('[data-testid="tweetText"]');
	if (!(tweetText instanceof HTMLElement)) {
		return;
	}

	// If the tweet contains words, apply fact-checking

	for (const sentence of filterList) {
		const regex = new RegExp(`\\b${sentence}\\b`, "gi");
		if (tweet.text.match(regex) && !factedTweets.includes(tweet.smartHash)) {
			wrapTextWithFactCheck(tweetText, sentence, factCheckInfo);
			factedTweets.push(tweet.smartHash);
			console.log(
				"Applied fact-checking to tweet:",
				`${tweet.smartHash} ${sentence}`,
			);
			break;
		}
	}

	if (
		tweet.element.textContent?.includes("Sponsorisé") &&
		!markedSponsorised.includes(tweet.smartHash)
	) {
		markedSponsorised.push(tweet.smartHash);
		tweet.element.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
		console.log("Marked sponsored tweet:", tweet.smartHash);
	}
}

function hashString(str: string): number {
	let hash = 0;

	if (str.length === 0) return hash;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}

	return hash;
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

// Exécuter la fonction lorsque la page est chargée
document.addEventListener("DOMContentLoaded", () => {
	extractPageElements();
	observeDOM();
});

// Exécuter également lors du défilement pour capturer les nouveaux tweets chargés dynamiquement
window.addEventListener("scroll", extractPageElements);

document.addEventListener("mouseover", (event) => {
	const target = event.target as HTMLElement;
	if (target.classList.contains("fact-check-highlight")) {
		updateTooltipContent(
			target.dataset.factCheckMessage || "",
			target.dataset.factCheckLink || "",
		);
		showTooltip(target);
	}
	if (target.classList.contains("fact-check-tooltip")) {
		tooltip.classList.add("visible");
	}
});

document.addEventListener("mouseout", (event) => {
	const target = event.target as HTMLElement;

	//if target is the tooltip or something inside the tooltip, don't hide it

	if (
		target.classList.contains("fact-check-highlight") ||
		!target.classList.contains("fact-check-tooltip")
	) {
		hideTooltip();
	}
});
