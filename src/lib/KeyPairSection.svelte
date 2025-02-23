<script lang="ts">
  import type { KeyPair } from './pgp';
  import PrivateKeySection from './PrivateKeySection.svelte';
  import PublicKeySection from './PublicKeySection.svelte';
  import { createEventDispatcher } from 'svelte';
  
  export let keyPair: KeyPair;
  
  const dispatch = createEventDispatcher<{
    delete: string;
  }>();
  
  $: userId = keyPair.publicKeyObj.getUserIDs()[0] || 'Anonymous';
  $: keyId = keyPair.publicKeyObj.getKeyID().toHex();

  function handleDelete() {
    dispatch('delete', keyId);
  }
</script>

<div class="collapse collapse-arrow bg-base-200 shadow-xl mb-2">
  <input type="checkbox" /> 
  <div class="collapse-title text-xl font-medium">
    {userId} ({keyId})
  </div>
  <div class="collapse-content">
    <PublicKeySection 
      publicKey={keyPair.publicKey}
      publicKeyObj={keyPair.publicKeyObj}
    />
    {#if keyPair.privateKeyObj}
      <PrivateKeySection 
        privateKey={keyPair.privateKey}
        privateKeyObj={keyPair.privateKeyObj}
      />
    {/if}
    <div class="card-actions justify-end">
      <button class="btn btn-error join-item" on:click={handleDelete}>
        Delete
      </button>
    </div>
  </div>
</div>
