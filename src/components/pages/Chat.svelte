<script lang="ts">
  import { onMount } from "svelte";
  import { Tchat } from "../../core/Tchat";
  import type { TchatAi } from "../../interfaces/TchatAi";
  import { conversation } from "../../storage";
  import Loading from "../Popup/Loading.svelte";

  let messages: TchatAi[] = [];
  let newMessage = "";
  let isThinking = false;

  // Ajoute un message de l'utilisateur
  function addUserMessage() {
    if (newMessage.trim()) {
      messages = [...messages, { content: newMessage, role: "user" }];
      newMessage = "";
      addRobotMessage();
      conversation.set(messages);
    }
  }

  // Ajoute un message du robot
  async function addRobotMessage() {
    isThinking = true;
    const response = (
      await Tchat.postUserMessageToTchatAi(
        messages[messages.length - 1].content
      )
    )?.content;

    messages = [...messages, { content: response, role: "assistant" }];
    isThinking = false;
    conversation.set(messages);
  }

  conversation.subscribe((value) => {
    messages = value;
  });

  function clearMessages() {
    messages = [
      {
        content:
          "Bonjour, je suis le modèle de Privacit. Comment puis-je vous aider ?",
        role: "assistant",
      },
    ];
    conversation.set(messages);
  }

  // Ajoute un message initial du robot au chargement de la page
  onMount(async () => {
    messages = await conversation.GetValueFromChromeStorage();
  });
</script>

<div
  class="bg-primary-light rounded-lg shadow-md p-6 max-w-2xl mx-auto h-[calc(100vh-2rem)] flex flex-col"
>
  <div class="flex justify-between w-full">
    <h2 class="text-xl font-bold mb-6">Chat</h2>
    <button
      on:click={() => clearMessages()}
      class="bg-accent-dark text-white rounded px-2 py-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-fit"
    >
      Nouveau chat
    </button>
  </div>

  <div class="flex-grow overflow-y-auto mb-4 space-y-4">
    {#each messages as message}
      <div
        class={`flex ${message.role == "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          class={`max-w-[70%] p-3 rounded-lg ${message.role == "user" ? "bg-accent-dark text-white" : "bg-gray-200"}`}
        >
          {message.content}
        </div>
      </div>
    {/each}
    {#if isThinking}
      <div class="flex justify-start">
        <div class="bg-gray-200 p-3 rounded-lg">
          <Loading />
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
