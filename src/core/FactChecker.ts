import type { PageContent } from "../interfaces/ContentData";
import type { FactCheckingResult } from "../interfaces/FactCheckingResult";

const styles = `
.fact-check-highlight {
  border-bottom: 1px dotted #fcba03;
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

export let factCheckerStyle: HTMLStyleElement;
let tooltip: HTMLDivElement;
let cache: Record<number, FactCheckingResult> = {};

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
export function wrapTextWithFactCheck(
    element: HTMLElement,
    factCheckInfo: FactCheckingResult,
) {
    injectFactChecker();
    // Put the span on the whole text
    const span = document.createElement("span");
    span.className = "fact-check-highlight";
    span.textContent = element.textContent || "";
    span.dataset.factCheckMessage = factCheckInfo.explanation;
    span.dataset.factCheckLink = `https://google.com/search?q=${factCheckInfo.search_query}`;
    element.innerHTML = ""; 
    element.appendChild(span);
}


export function injectFactChecker() {
    if (document.getElementById("FactCheckerStyle")) {
        return;
    }

    // Injecter les styles dans la page
    factCheckerStyle = document.createElement("style");
    factCheckerStyle.textContent = styles;
    factCheckerStyle.id = "FactCheckerStyle";
    document.head.appendChild(factCheckerStyle);

    tooltip = document.createElement("div");
    tooltip.className = "fact-check-tooltip";
    document.body.appendChild(tooltip);

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

    console.log("Fact checker injected");
}

let analysing: Set<number> = new Set();
export async function FactCheckContent(content: PageContent) {
    let analysis: FactCheckingResult | undefined | null;
    if(!cache[content.smartHash]) {
        console.log("Fact checking cache", cache);
        if (analysing.has(content.smartHash)) {
            return;
        }
        analysing.add(content.smartHash);
        analysis = await fact_analyse(content.text);
        analysing.delete(content.smartHash);
        if (analysis) {
            cache[content.smartHash] = analysis;
        }
    } else {
        analysis = cache[content.smartHash];
    }

    if (!analysis) {
        return;
    }

    wrapTextWithFactCheck(content.textElement, analysis);
}

function fact_analyse(text: string): Promise<FactCheckingResult | undefined | null> {
    return new Promise((res) => {
        chrome.runtime.sendMessage({ type: "factCheck", data: text }, async (response) => {
            console.log("Response from chrome", response);
            res(JSON.parse(response));
        });
    });
}