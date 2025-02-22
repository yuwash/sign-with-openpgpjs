<script lang="ts">
  import type { KeyPair } from './lib/pgp';
  import AddKeys from './lib/AddKeys.svelte';
  import KeyPairSection from './lib/KeyPairSection.svelte';
  
  let keyPairs: KeyPair[] = [];

  function handleAddKeys(event: CustomEvent<KeyPair>) {
    const newKeyPair = event.detail;
    const existingIndex = keyPairs.findIndex(kp => 
      kp.publicKeyObj.getKeyID().equals(newKeyPair.publicKeyObj.getKeyID())
    );

    if (existingIndex >= 0) {
      keyPairs[existingIndex] = newKeyPair;
      keyPairs = keyPairs;
    } else {
      keyPairs = [...keyPairs, newKeyPair];
    }
  }

  function handleDeleteKeyPair(event: CustomEvent<string>) {
    const keyId = event.detail;
    keyPairs = keyPairs.filter(kp => kp.publicKeyObj.getKeyID().toHex() !== keyId);
  }
</script>

<main class="container mx-auto p-4 max-w-3xl">
  <h1 class="text-3xl font-bold text-center mb-8">Sign with OpenPGP.js</h1>

  <AddKeys on:addKeys={handleAddKeys} />

  {#if keyPairs.length > 0}
    <div class="mt-8">
      {#each keyPairs as keyPair}
        <KeyPairSection 
          {keyPair} 
          on:delete={handleDeleteKeyPair}
        />
      {/each}
    </div>
  {/if}
</main>