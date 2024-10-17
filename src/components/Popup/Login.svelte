<script>
  export let onNavigate;
</script>

<div class="flex flex-col self-center rounded-sm items-center align-middle content-evenly p-6 w-96 h-96 bg-zinc-800">
  <img
    src="https://media.discordapp.net/attachments/1295309864670855223/1295322779352039517/Logo_B-W.png?ex=670e3ad8&is=670ce958&hm=497bc1e3492285b417fffd561ff1f01270bb9efbfa9a983f304a81c3390642ff&=&format=webp&quality=lossless"
    alt="Logo"
    class="invert h-20 w-20 rounded-full"
  />
  <div class="w-auto content-evenly flex flex-wrap">
    <button on:click={() => onNavigate('register')} class="p-1 text-zinc-100 underline">
      S'enregistrer
    </button>
    <div class="w-10"></div>
    <button class="bg-zinc-400 text-zinc-800 rounded-md p-1 w-24 text-center font-bold">
      OK
    </button>
  </div>
</div>