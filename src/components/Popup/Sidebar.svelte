<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let activeItem = "Account";

  const menuItems = [
    { name: "Profile", icon: "👤" },
    { name: "Account", icon: "🔐" },
    { name: "Chat", icon: "💬" },
    { name: "Stats", icon: "🔔" },
    { name: "Filters", icon: "🔍" },
    { name: "Sites", icon: "🌐" },
  ];

  function handleClick(item) {
    activeItem = item;
    dispatch("pageChange", item);
  }
</script>

<aside class="w-48 bg-primary-light shadow-md p-6">
  <h1 class="text-2xl font-bold mb-6">Settings</h1>
  <nav>
    <ul class="space-y-2">
      {#each menuItems as item}
        <li>
          <button
            class="w-full text-left py-2 px-4 rounded transition-colors duration-200 {activeItem ===
            item.name
              ? 'bg-blue-100 text-primary-dark'
              : 'text-secondary-DEFAULT hover:bg-gray-100'}"
            on:click={() => handleClick(item.name)}
          >
            <span class="mr-2">{item.icon}</span>
            {item.name}
          </button>
        </li>
      {/each}
    </ul>
  </nav>
</aside>
