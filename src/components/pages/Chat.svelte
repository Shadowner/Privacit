<script lang="ts">
  import { onMount } from "svelte";

  let messages: {text:string, isUser:boolean}[] = [];
  let newMessage = "";
  let isThinking = false;

  // Simule un délai pour la réponse du robot
  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Ajoute un message de l'utilisateur
  function addUserMessage() {
    if (newMessage.trim()) {
      messages = [...messages, { text: newMessage, isUser: true }];
      newMessage = "";
      addRobotMessage();
    }
  }

  // Ajoute un message du robot
  async function addRobotMessage() {
    isThinking = true;
    await delay(2000); // Simule un délai de réflexion
    const robotResponses = [
      "Je comprends votre point de vue.",
      "C'est une excellente question.",
      "Pouvez-vous m'en dire plus ?",
      "Laissez-moi réfléchir à cela.",
      "Voici ce que je pense à ce sujet...",
    ];
    const randomResponse =
      robotResponses[Math.floor(Math.random() * robotResponses.length)];
    messages = [...messages, { text: randomResponse, isUser: false }];
    isThinking = false;
  }

  // Ajoute un message initial du robot au chargement de la page
  onMount(() => {
    addRobotMessage();
  });
</script>

<div
  class="bg-primary-light rounded-lg shadow-md p-6 max-w-2xl mx-auto h-[calc(100vh-2rem)] flex flex-col"
>
  <h2 class="text-xl font-bold mb-6">Chat</h2>

  <div class="flex-grow overflow-y-auto mb-4 space-y-4">
    {#each messages as message}
      <div class={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
        <div
          class={`max-w-[70%] p-3 rounded-lg ${message.isUser ? "bg-accent-dark text-white" : "bg-gray-200"}`}
        >
          {message.text}
        </div>
      </div>
    {/each}
    {#if isThinking}
      <div class="flex justify-start">
        <div class="bg-gray-200 p-3 rounded-lg">
          Le robot est en train de réfléchir...
        </div>
      </div>
    {/if}
  </div>

  <div class="flex items-center">
    <input
      type="text"
      bind:value={newMessage}
      on:keypress={(e) => e.key === "Enter" && addUserMessage()}
      placeholder="Tapez votre message..."
      class="flex-grow border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      on:click={addUserMessage}
      class="bg-accent-dark text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Envoyer
    </button>
  </div>
</div>
