<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let activeItem = "Profile";

  const menuItems = [
    { name: "Profile", icon: "👤" },
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
  <div class="flex flex-col items-center w-full">
    <img src="https://media.discordapp.net/attachments/1295309864670855223/1296456621484150784/output-onlinepngtools.png?ex=67125ad1&is=67110951&hm=9d9299386b459fd53fcc01b8b20ab3ea28cdfd820b8a019ca47886993c198e9a&=&format=webp&quality=lossless" />
    <h1 class="text-2xl font-bold mb-6">PRIVACIT</h1>
  </div>
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
