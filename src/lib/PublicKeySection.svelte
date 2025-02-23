<script lang="ts">
  import type { Key } from 'openpgp';
  import { verifyMessage } from './pgp';
  import { downloadKey } from './utils';
  import CollapsibleCard from './CollapsibleCard.svelte';

  export let publicKey: string;
  export let publicKeyObj: Key;

  let signedMessage = '';
  let verificationResult: boolean | null = null;

  $: fingerprint = publicKeyObj.getFingerprint();

  $: if (signedMessage) {
    verifySignedMessage();
  } else {
    verificationResult = null;
  }

  async function verifySignedMessage() {
    try {
      verificationResult = await verifyMessage(signedMessage, publicKey);
    } catch (error) {
      console.error('Error verifying signature:', error);
      verificationResult = false;
    }
  }

  function copyPublicKey() {
    navigator.clipboard.writeText(publicKey);
  }
</script>

<CollapsibleCard label="Public Key" open={true}>
  <div class="card-body">
    <p class="content">Fingerprint: <code>{fingerprint}</code></p>
    <textarea
      class="textarea is-bordered is-family-monospace is-full block"
      readonly
      value={publicKey}
    />
    <div class="buttons has-addons">
      <button class="button is-primary" on:click={copyPublicKey}>
        Copy
      </button>
      <button
        class="button is-primary"
        on:click={() => downloadKey(publicKeyObj, true)}
      >
        Download
      </button>
      <button
        class="button is-primary"
        on:click={() => downloadKey(publicKeyObj, false)}
      >
        Download (unarmored)
      </button>
    </div>

    <CollapsibleCard label="Verify Signature" open={false}>
      <label class="label">
        <span class="label-text">Signed Message</span>
      </label>
      <textarea
        bind:value={signedMessage}
        placeholder="Paste the signed message here"
        class="textarea is-bordered is-full block"
      />

      {#if signedMessage && verificationResult !== null}
        <div
          class="notification {verificationResult ? 'is-success' : 'is-error'}"
        >
          {verificationResult
            ? 'Signature verified successfully!'
            : 'Signature verification failed!'}
        </div>
      {/if}
    </CollapsibleCard>
  </div>
</CollapsibleCard>
