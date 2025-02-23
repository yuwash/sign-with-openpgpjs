<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { KeyPair } from './pgp';
  import { generateKeyPair } from './pgp';

  const dispatch = createEventDispatcher<{
    addKeys: KeyPair;
  }>();

  let name = '';
  let email = '';
  let keyType: 'ecc' | 'rsa' = 'ecc';
  let generating = false;

  async function handleGenerateKey() {
    if (!name) return;
    
    try {
      generating = true;
      const newKeyPair = await generateKeyPair({ 
        name, 
        email: email || undefined, 
        type: keyType 
      });
      dispatch('addKeys', newKeyPair);
      name = '';
      email = '';
    } catch (error) {
      console.error('Error generating key:', error);
      alert('Failed to generate key');
    } finally {
      generating = false;
    }
  }
</script>

<div class="card-content">
    <div class="field">
      <label class="label">
        <span class="label-text">Name (required)</span>
      </label>
      <input
        type="text"
        bind:value={name}
        placeholder="Your name"
        class="input"
        required
      />
    </div>
    <div class="field">
      <label class="label">
        <span class="label-text">Email (optional)</span>
      </label>
      <input
        type="email"
        bind:value={email}
        placeholder="your@email.com"        
        class="input"
      />
    </div>
    <label class="label">
      <span class="label-text">Key Type</span>
    </label>
    <div class="select is-fullwidth block">
      <select bind:value={keyType} >
	<option value="ecc">ECC (fast)</option>
	<option value="rsa">RSA (compatible)</option>
      </select>
    </div>
    <button
      class="button is-primary"
      on:click={handleGenerateKey}
      disabled={generating || !name}
    >
      {generating ? 'Generating...' : 'Generate Key'}
    </button>
</div>
