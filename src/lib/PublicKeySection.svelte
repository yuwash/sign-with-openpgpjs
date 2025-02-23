<script lang="ts">
  import type { Key } from 'openpgp';
  import { verifyMessage } from './pgp';
  import { downloadKey } from './utils';
  
  export let publicKey: string;
  export let publicKeyObj: Key;
  
  let signedMessage = '';
  let verificationResult: boolean | null = null;
  let showVerifySection = false;

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

<div class="card bg-base-100 shadow-xl mb-2">
  <div class="card-body">
    <h3 class="card-title">Public Key</h3>
    <p>Fingerprint: <code>{fingerprint}</code></p>
    <textarea
      class="textarea textarea-bordered font-mono w-full"
      readonly
      value={publicKey}
    />
    <div class="join">
      <button
        class="btn btn-primary join-item"
        on:click={copyPublicKey}
      >
        Copy
      </button>
      <button
        class="btn btn-primary join-item"
        on:click={() => downloadKey(publicKeyObj, true)}
      >
        Download
      </button>
      <button
        class="btn btn-primary join-item"
        on:click={() => downloadKey(publicKeyObj, false)}
      >
        Download (unarmored)
      </button>
    </div>

    <div class="collapse bg-base-200">
      <input type="checkbox" bind:checked={showVerifySection} />
      <h4 class="collapse-title text-xl">
        Verify Signature
      </h4>
      <div class="collapse-content">
        <label class="label">
          <span class="label-text">Signed Message</span>
        </label>
        <textarea
          bind:value={signedMessage}
          placeholder="Paste the signed message here"
          class="textarea textarea-bordered w-full"
        />

        {#if signedMessage && verificationResult !== null}
          <div class="alert {verificationResult ? 'alert-success' : 'alert-error'}">
            {verificationResult
              ? 'Signature verified successfully!'
              : 'Signature verification failed!'}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
