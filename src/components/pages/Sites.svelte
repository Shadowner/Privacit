<script lang="ts">
  import { onMount } from "svelte";
  import { contentSeeking } from "../../storage";

  interface BaseContentSeeking {
    url: string;
    parentSelector: string;
    textSelector: string;
    factCheck?: boolean;
    uniqueIdentifierSelector?: string;
    sentimentAnalysis?: boolean;
    rephrase?: boolean;
  }

  let sites: BaseContentSeeking[] = $contentSeeking;
  let editingSite: BaseContentSeeking | null = null;
  let isEditing = false;

  onMount(() => {
    // Chargez ici les sites depuis votre stockage (par exemple, chrome.storage.sync)
    // Pour cet exemple, nous utiliserons des données factices
  });

  function getFaviconUrl(url: string): string {
    return `https://www.google.com/s2/favicons?domain=${url}&sz=32`;
  }

  let originalUrl: string = "";

  function editSite(site: BaseContentSeeking) {
    editingSite = { ...site };
    originalUrl = site.url; // Stocke l'URL originale pour la comparaison lors de la sauvegarde
    isEditing = true;
  }

  function saveSite() {
    if (editingSite) {
      const index = sites.findIndex((s) => s.url === originalUrl);
      if (index !== -1) {
        // Mise à jour d'un site existant
        sites[index] = editingSite;
      } else {
        // Ajout d'un nouveau site
        sites = [...sites, editingSite];
      }
      sites = [...sites]; // Déclenche une mise à jour réactive
      // Sauvegardez ici les sites dans votre stockage (par exemple, chrome.storage.sync)
    }
    contentSeeking.set(sites);
    isEditing = false;
    editingSite = null;
    originalUrl = "";
  }

  function createNewSite() {
    editingSite = {
      url: "",
      parentSelector: "",
      textSelector: "",
    };
    isEditing = true;
  }

  function deleteSite(url: string) {
    sites = sites.filter((s) => s.url !== url);
    // Sauvegardez ici les sites mis à jour dans votre stockage
  }
</script>

<div class="bg-primary-light rounded-lg shadow-md p-6 max-w-4xl mx-auto">
  <h2 class="text-xl font-bold mb-6">Compatible Sites</h2>

  <div class="flex justify-between mb-4">
    <div class="text-sm text-secondary-DEFAULT">{sites.length} sites</div>
    <button
      class="bg-accent-dark text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      on:click={createNewSite}
    >
      Add New Site
    </button>
  </div>

  {#if isEditing}
    <div class="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 class="text-lg font-semibold mb-3">
        {editingSite.url ? "Edit Site" : "Add New Site"}
      </h3>
      <form on:submit|preventDefault={saveSite} class="space-y-4">
        <div>
          <label for="url" class="block text-sm font-medium text-gray-700"
            >URL</label
          >
          <input
            type="text"
            id="url"
            bind:value={editingSite.url}
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            for="parentSelector"
            class="block text-sm font-medium text-gray-700"
            >Parent Selector</label
          >
          <input
            type="text"
            id="parentSelector"
            bind:value={editingSite.parentSelector}
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            for="textSelector"
            class="block text-sm font-medium text-gray-700">Text Selector</label
          >
          <input
            type="text"
            id="textSelector"
            bind:value={editingSite.textSelector}
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="flex items-center">
            <input
              type="checkbox"
              bind:checked={editingSite.factCheck}
              class="rounded border-gray-300 text-primary-dark shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-secondary-DEFAULT">Fact Check</span>
          </label>
        </div>
        <div>
          <label
            for="uniqueIdentifierSelector"
            class="block text-sm font-medium text-gray-700"
            >Unique Identifier Selector</label
          >
          <input
            type="text"
            id="uniqueIdentifierSelector"
            bind:value={editingSite.uniqueIdentifierSelector}
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="flex items-center">
            <input
              type="checkbox"
              bind:checked={editingSite.sentimentAnalysis}
              class="rounded border-gray-300 text-primary-dark shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-secondary-DEFAULT"
              >Sentiment Analysis</span
            >
          </label>
        </div>
        <div>
          <label class="flex items-center">
            <input
              type="checkbox"
              bind:checked={editingSite.rephrase}
              class="rounded border-gray-300 text-primary-dark shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-secondary-DEFAULT">Rephrase</span>
          </label>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            on:click={() => {
              isEditing = false;
              editingSite = null;
            }}
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  {/if}

  <ul class="space-y-2">
    {#each sites as site (site.url)}
      <li
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center space-x-3">
          <img src={getFaviconUrl(site.url)} alt="Favicon" class="w-6 h-6" />
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary-dark hover:underline">{site.url}</a
          >
        </div>
        <div class="space-x-2">
          <button
            on:click={() => editSite(site)}
            class="text-sm text-secondary-DEFAULT hover:text-primary-dark"
            >Edit</button
          >
          <button
            on:click={() => deleteSite(site.url)}
            class="text-sm text-red-600 hover:text-red-800">Delete</button
          >
        </div>
      </li>
    {/each}
  </ul>
</div>
