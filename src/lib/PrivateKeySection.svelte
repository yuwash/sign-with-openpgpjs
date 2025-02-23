<script lang="ts">
  import type { PrivateKey } from 'openpgp';
  import { signMessage } from './pgp';
  import { downloadKey } from './utils';

  export let privateKey: string;
  export let privateKeyObj: PrivateKey;
  
  let message = '';
  let signedMessage = '';
  let signing = false;
  let downloading = false;
  let showSignSection = false;

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

<div class="card bg-base-100 shadow-xl mb-2">
  <div class="card-body">
    <h3 class="card-title">Private Key</h3>
    <p>Fingerprint: <code>{fingerprint}</code></p>
    
    <div class="collapse bg-base-200">
      <input type="checkbox" bind:checked={showSignSection} /> 
      <h4 class="collapse-title text-xl">
        Sign Message
      </h4>
      <div class="collapse-content">
        <label class="label">
          <span class="label-text">Message to Sign</span>
        </label>
        <textarea
          bind:value={message}
          placeholder="Enter a message to sign"
          class="textarea textarea-bordered w-full"
        />
        <button
          class="btn btn-primary"
          on:click={handleSignMessage}
          disabled={signing || !message}
        >
          {signing ? 'Signing...' : 'Sign Message'}
        </button>

        {#if signedMessage}
          <label class="label">
            <span class="label-text">Signed Message</span>
          </label>
          <textarea
            class="textarea textarea-bordered font-mono w-full"
            readonly
            value={signedMessage}
          />
        {/if}
      </div>
    </div>
    <p class="text-warning">
      Important: This private key should be stored securely and not shared with anyone.
    </p>
    <div class="join">
      <button class="btn btn-warning join-item" on:click={() => downloadKey(privateKeyObj, true)} disabled={downloading}>
        {#if downloading}
          Downloading...
        {:else}Download{/if}
      </button>
      <button class="btn btn-warning join-item" on:click={() => downloadKey(privateKeyObj, false)} disabled={downloading}>
        {#if downloading}
          Downloading...
        {:else}Download (unarmored){/if}
      </button>
    </div>
  </div>
</div>
