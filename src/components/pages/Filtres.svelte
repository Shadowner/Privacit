<script lang="ts">
  import { fade } from "svelte/transition";
  import { filterList } from "../../storage";

  let filteredWords: string[] = $filterList;
  let newWord = "";
  let filterAction = "paraphrase";
  let factCheckingEnabled = false;

  function addWord() {
    if (newWord.trim() && !filteredWords.includes(newWord.trim())) {
      filteredWords = [...filteredWords, newWord.trim()];
      newWord = "";
      filterList.set(filteredWords);
    }
  }

  function removeWord(word: string) {
    filteredWords = filteredWords.filter((w) => w !== word);
    filterList.set(filteredWords);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      addWord();
    }
  }
</script>

<div class="bg-primary-light rounded-lg shadow-md p-6 max-w-2xl mx-auto">
  <h2 class="text-xl font-bold mb-6">Filtres</h2>

  <div class="space-y-6">
    <div>
      <h3 class="text-sm font-medium text-gray-700 mb-2">
        Liste de mots à filtrer
      </h3>
      <div class="flex flex-wrap gap-2 mb-2">
        {#each filteredWords as word}
          <span
            transition:fade
            class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
          >
            {word}
            <button
              on:click={() => removeWord(word)}
              class="ml-2 text-primary-dark hover:text-blue-800"
            >
              &times;
            </button>
          </span>
        {/each}
      </div>
      <div class="flex">
        <input
          type="text"
          bind:value={newWord}
          on:keydown={handleKeydown}
          placeholder="Ajouter un mot à filtrer"
          class="flex-grow border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          on:click={addWord}
          class="bg-accent-dark text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Ajouter
        </button>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-medium text-gray-700 mb-2">
        Action pour les mots filtrés
      </h3>
      <div class="flex items-center space-x-4">
        <label class="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            name="filterAction"
            value="paraphrase"
            bind:group={filterAction}
            class="hidden"
          />
          <div class="relative">
            <div
              class="w-10 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out"
              class:bg-accent-dark={filterAction === "paraphrase"}
              class:bg-gray-300={filterAction !== "paraphrase"}
            ></div>
            <div
              class="absolute w-4 h-4 bg-primary-light rounded-full shadow inset-y-1 left-1 transition-transform duration-300 ease-in-out"
              style="transform: {filterAction === 'paraphrase'
                ? 'translateX(16px)'
                : 'translateX(0)'}"
            ></div>
          </div>
          <span class="ml-2">Paraphraser</span>
        </label>
        <label class="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            name="filterAction"
            value="delete"
            bind:group={filterAction}
            class="hidden"
          />
          <div class="relative">
            <div
              class="w-10 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out"
              class:bg-accent-dark={filterAction === "delete"}
              class:bg-gray-300={filterAction !== "delete"}
            ></div>
            <div
              class="absolute w-4 h-4 bg-primary-light rounded-full shadow inset-y-1 left-1 transition-transform duration-300 ease-in-out"
              style="transform: {filterAction === 'delete'
                ? 'translateX(16px)'
                : 'translateX(0)'}"
            ></div>
          </div>
          <span class="ml-2">Supprimer</span>
        </label>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-medium text-gray-700 mb-2">Fact Checking</h3>
      <label class="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="hidden"
          bind:checked={factCheckingEnabled}
        />
        <div class="relative">
          <div
            class="w-10 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out"
            class:bg-accent-dark={factCheckingEnabled}
            class:bg-gray-300={!factCheckingEnabled}
          ></div>
          <div
            class="absolute w-4 h-4 bg-primary-light rounded-full shadow inset-y-1 left-1 transition-transform duration-300 ease-in-out"
            style="transform: {factCheckingEnabled
              ? 'translateX(16px)'
              : 'translateX(0)'}"
          ></div>
        </div>
        <span class="ml-2">Activer le Fact Checking</span>
      </label>
    </div>
  </div>
</div>
