<script>
  import Sidebar from "./Sidebar.svelte";
  import SettingsView from "./SettingView.svelte";
  import StatsView from "./Stats.svelte";


  export let activeView;
  export let onNavigate;
</script>

<div class="flex flex-row justify-between rounded-md h-96 w-[28rem] bg-zinc-800">
  <Sidebar {activeView} {onNavigate} />
  {#if activeView === 'settings'}
    <SettingsView />
  {:else if activeView === 'stats'}
    <StatsView />
  {/if}
</div>