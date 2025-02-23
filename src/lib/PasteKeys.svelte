<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { KeyPair } from './pgp';
  import { processKeys } from './utils';

  const dispatch = createEventDispatcher<{
    addKeys: KeyPair;
  }>();

  let pasteInput = '';
  let loading = false;
  let status: { type: 'success' | 'error'; message: string } | null = null;

  async function handlePaste() {
    if (!pasteInput.trim()) return;

    loading = true;
    status = null;
    try {
      const keyPair = await processKeys(pasteInput);
      dispatch('addKeys', keyPair);
      pasteInput = '';
      status = { type: 'success', message: 'Keys imported successfully!' };
    } catch (error) {
      console.error('Error reading pasted keys:', error);
      status = { type: 'error', message: 'Failed to read keys. Please check the input format.' };
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
  {#if status}
    <div class="notification {status.type === 'success' ? 'is-success' : 'is-danger'}">
      <span>{status.message}</span>
    </div>
  {/if}
</div>
