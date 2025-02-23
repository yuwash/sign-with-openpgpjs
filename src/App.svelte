<script lang="ts">
  import type { KeyPair } from './lib/pgp';
  import AddKeys from './lib/AddKeys.svelte';
  import KeyPairSection from './lib/KeyPairSection.svelte';
  
  let keyPairs: Map<string, KeyPair> = new Map();

  function handleAddKeys(event: CustomEvent<KeyPair>) {
    const newKeyPair = event.detail;
    const keyId = newKeyPair.publicKeyObj.getKeyID().toHex();

    keyPairs.set(keyId, newKeyPair);
    keyPairs = keyPairs; // Trigger reactivity
  }

  function handleDeleteKeyPair(event: CustomEvent<string>) {
    const keyId = event.detail;
    keyPairs.delete(keyId);
    keyPairs = keyPairs; // Trigger reactivity
  }
</script>

<main class="container is-max-desktop">
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <h1 class="navbar-item title">Sign with OpenPGP.js</h1>
    </div>
    <div class="navbar-end">
      <a class="navbar-item" href="https://github.com/yuwash/sign-with-openpgpjs">GitHub</a>
    </div>
  </nav>

  <AddKeys on:addKeys={handleAddKeys} />

  <div class="key-pairs">
    {#each Array.from(keyPairs.values()) as keyPair}
      <KeyPairSection 
        {keyPair} 
        on:delete={handleDeleteKeyPair}
      />
    {/each}
  </div>
</main>
