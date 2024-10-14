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

export interface FactCheckInfo {
    message: string;
    link: string;
}

export let factCheckerStyle: HTMLStyleElement;
let tooltip: HTMLDivElement;


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


export function injectFactChecker() {
    // Injecter les styles dans la page
    factCheckerStyle = document.createElement("style");
    factCheckerStyle.textContent = styles;
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
