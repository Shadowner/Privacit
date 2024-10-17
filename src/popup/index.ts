import Options from "../components/Options.svelte";

// Action popup
// https://developer.chrome.com/docs/extensions/reference/action/

function render() {
    const target = document.getElementById("app");

    if (target) {
        new Options({
            target,
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
