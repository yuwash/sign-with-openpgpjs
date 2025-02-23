<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { KeyPair } from './pgp';
  import { processKeys } from './utils';
  import StatusNotification from './StatusNotification.svelte';

  const dispatch = createEventDispatcher<{
    addKeys: KeyPair;
  }>();

  let fileInput: HTMLInputElement;
  let loading = false;
  let statusNotification: StatusNotification;

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    loading = true;
    try {
      const file = input.files[0];
      const content = await file.arrayBuffer();

      try {
        const text = new TextDecoder().decode(content);
        const keyPair = await processKeys(text);
        dispatch('addKeys', keyPair);
        input.value = '';
        statusNotification.post('Keys imported successfully!');
      } catch (armoredError) {
        console.log('Armored format failed, trying binary...');
        try {
          const keyPair = await processKeys(new Uint8Array(content));
          dispatch('addKeys', keyPair);
          input.value = '';
          statusNotification.post('Keys imported successfully!');
        } catch (binaryError) {
          console.error('Error reading key file:', binaryError);
          statusNotification.postError('Failed to read key file. Please check the file format.');
        }
      }
    } catch (error) {
      console.error('Error reading key file:', error);
      statusNotification.postError('Failed to read key file. Please check the file format.');
    } finally {
      loading = false;
    }
  }
</script>

<div class="card-content">
  <p>
    Import a key pair or public key from a file. Supports both armored and binary formats.
  </p>
  <div class="file block">
    <label class="file-label">
      <input
        type="file"
        bind:this={fileInput}
        on:change={handleFileChange}
        accept=".asc,.gpg,.pgp"
        class="file-input"
        disabled={loading}
      />
      <span class="file-cta">
        <span class="file-label"> Choose a file… </span>
      </span>
    </label>
  </div>
  <StatusNotification bind:this={statusNotification} />
</div>
