import type { PageContent } from "../interfaces/ContentData";


export function addToAd(element: PageContent){
    element.element.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
    console.log("Marked as Ad");
}