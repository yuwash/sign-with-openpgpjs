<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { KeyPair } from './pgp';
  import { processKeys } from './utils';
  import StatusNotification from './StatusNotification.svelte';

  const dispatch = createEventDispatcher<{
    addKeys: KeyPair;
  }>();

  let pasteInput = '';
  let loading = false;
  let statusNotification: StatusNotification;

  async function handlePaste() {
    if (!pasteInput.trim()) return;

    loading = true;
    try {
      const keyPair = await processKeys(pasteInput);
      dispatch('addKeys', keyPair);
      pasteInput = '';
      statusNotification.post('Keys imported successfully!');
    } catch (error) {
      console.error('Error reading pasted keys:', error);
      statusNotification.postError('Failed to read keys. Please check the input format.');
    } finally {
      loading = false;
    }
  }
</script>

<div class="card-content">
  <p>
    Paste your armored public key or key pair here.
  </p>
  <textarea
    bind:value={pasteInput}
    placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----"
    class="textarea is-family-monospace block"
    disabled={loading}
  />
  <button
    class="button is-primary block"
    on:click={handlePaste}
    disabled={loading || !pasteInput.trim()}
  >
    {loading ? 'Loading...' : 'Import Keys'}
  </button>
  <StatusNotification bind:this={statusNotification} />
</div>
