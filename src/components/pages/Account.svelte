<script>
  let email = "kev.heart@mail.com";
  let language = "English";
  let newFriend = true;
  let channelsFriend = true;
  let authenticatorApp = false;
</script>

<div class="bg-primary-light rounded-lg shadow-md p-6 max-w-2xl mx-auto">
  <h2 class="text-xl font-bold mb-6">Account Settings</h2>
  
  <div class="space-y-6">
    <div>
      <h3 class="text-sm font-medium text-gray-500 mb-1">Email</h3>
      <p class="text-sm">{email}</p>
    </div>
    
    <div>
      <h3 class="text-sm font-medium text-gray-500 mb-1">Password</h3>
      <button class="bg-accent-dark text-white px-3 py-1 rounded text-sm">Change password</button>
    </div>
    
    <div>
      <h3 class="text-sm font-medium text-gray-500 mb-1">Language</h3>
      <select class="border rounded px-2 py-1 text-sm" bind:value={language}>
        <option>English</option>
        <option>Français</option>
        <option>Español</option>
      </select>
    </div>
    
    <!-- Ajoutez ici les autres éléments de la page Account -->
    
  </div>
</div>