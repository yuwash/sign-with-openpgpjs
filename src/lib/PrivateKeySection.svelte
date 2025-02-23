<script lang="ts">
  import type { PrivateKey } from 'openpgp';
  import { signMessage } from './pgp';
  import { downloadKey } from './utils';
  import CollapsibleCard from './CollapsibleCard.svelte';

  export let privateKey: string;
  export let privateKeyObj: PrivateKey;

  let message = '';
  let signedMessage = '';
  let signing = false;
  let downloading = false;

  $: fingerprint = privateKeyObj.getFingerprint();

  async function handleSignMessage() {
    if (!privateKey || !message) return;

    try {
      signing = true;
      signedMessage = await signMessage(message, privateKey);
    } catch (error) {
      console.error('Error signing message:', error);
      alert('Failed to sign message');
    } finally {
      signing = false;
    }
  }
</script>

<CollapsibleCard label="Private Key" open={true}>
  <div class="card-body">
    <p class="content">Fingerprint: <code>{fingerprint}</code></p>

    <CollapsibleCard label="Sign Message" open={false}>
      <label class="label">
        <span class="label-text">Message to Sign</span>
      </label>
      <textarea
        bind:value={message}
        placeholder="Enter a message to sign"
        class="textarea block"
      />
      <button
        class="button is-primary"
        on:click={handleSignMessage}
        disabled={signing || !message}
        class:is-loading={signing}
      >
        {signing ? 'Signing...' : 'Sign Message'}
      </button>

      {#if signedMessage}
        <label class="label">
          <span class="label-text">Signed Message</span>
        </label>
        <textarea
          class="textarea is-family-monospace block"
          readonly
          value={signedMessage}
        />
      {/if}
    </CollapsibleCard>
    <p class="text-warning">
      Important: This private key should be stored securely and not shared with
      anyone.
    </p>
    <div class="buttons has-addons">
      <button
        class="button is-warning"
        on:click={() => downloadKey(privateKeyObj, true)}
        disabled={downloading}
        class:is-loading={downloading}
      >
        {#if downloading}
          Downloading...
        {:else}Download{/if}
      </button>
      <button
        class="button is-warning"
        on:click={() => downloadKey(privateKeyObj, false)}
        disabled={downloading}
      >
        {#if downloading}
          Downloading...
        {:else}Download (unarmored){/if}
      </button>
    </div>
  </div>
</CollapsibleCard>
