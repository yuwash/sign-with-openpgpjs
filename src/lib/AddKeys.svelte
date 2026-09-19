<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { KeyPair } from './pgp';
  import GenerateKey from './GenerateKey.svelte';
  import LoadKeyFile from './LoadKeyFile.svelte';
  import PasteKeys from './PasteKeys.svelte';

  const dispatch = createEventDispatcher<{
    addKeys: KeyPair;
  }>();

  let activeTab = 0;
</script>

<div class="card block">
  <div class="card-content">
    <div class="tabs">
      <ul>
        <li class:is-active={activeTab === 0}>
          <a href="#generate" on:click|preventDefault={() => (activeTab = 0)}>Generate Key</a>
        </li>
        <li class:is-active={activeTab === 1}>
          <a href="#load" on:click|preventDefault={() => (activeTab = 1)}>Load Key File</a>
        </li>
        <li class:is-active={activeTab === 2}>
          <a href="#paste" on:click|preventDefault={() => (activeTab = 2)}>Paste Keys</a>
        </li>
      </ul>
    </div>
    {#if activeTab === 0}
      <GenerateKey on:addKeys={e => dispatch('addKeys', e.detail)} />
    {:else if activeTab === 1}
      <LoadKeyFile on:addKeys={e => dispatch('addKeys', e.detail)} />
    {:else if activeTab === 2}
      <PasteKeys on:addKeys={e => dispatch('addKeys', e.detail)} />
    {/if}
  </div>
</div>
