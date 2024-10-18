import Options from "../components/Options.svelte";

// Side panel
// https://developer.chrome.com/docs/extensions/reference/sidePanel/

function render() {
    const target = document.getElementById("app");

    if (target) {
        new Options({
            target,
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
