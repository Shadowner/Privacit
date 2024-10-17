<script lang="ts">
  import Sidebar from './Popup/Sidebar.svelte';
  import Stats from './Popup/Stats.svelte';
  import Chat from './pages/Chat.svelte';
  import Filters from './pages/Filtres.svelte';
    import Sites from './pages/Sites.svelte';

  let currentPage = 'Account';

  const pages: Record<string,any> = {
    // Profile,
    Chat,
    Stats,
    Filters,
    Sites,
    // VoiceVideo,
    // Appearance,
    Notification
  };

  function handlePageChange(event: CustomEvent<string>) {
    console.log(event.detail, currentPage, pages[currentPage]);
    currentPage = event.detail;
  }
</script>

<div class="flex bg-gray-100 min-h-screen w-full overflow-hidden h-full">
  <Sidebar on:pageChange={handlePageChange} />
  <main class="flex-grow p-2">
    <svelte:component this={pages[currentPage]} />
  </main>
</div>