<script lang="ts">
  import type { KeyPair } from './pgp';
  import PrivateKeySection from './PrivateKeySection.svelte';
  import PublicKeySection from './PublicKeySection.svelte';
  import CollapsibleCard from './CollapsibleCard.svelte';
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

<CollapsibleCard label="{userId} ({keyId})" open={false}>
  <div class="card-content">
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
  </div>
  <footer class="card-footer">
    <div class="card-footer-item">
      <button class="button is-danger" on:click={handleDelete}>
        Delete
      </button>
    </div>
  </footer>
</CollapsibleCard>
