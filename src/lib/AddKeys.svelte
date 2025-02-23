<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { KeyPair } from './pgp';
  import GenerateKey from './GenerateKey.svelte';
  import LoadKeyFile from './LoadKeyFile.svelte';
  import PasteKeys from './PasteKeys.svelte';

  const dispatch = createEventDispatcher<{
    addKeys: KeyPair;
  }>();
</script>

<div class="card bg-base-100 shadow-xl mb-2">
<div role="tablist" class="tabs tabs-bordered">
  <input 
    type="radio" 
    name="add_keys_tabs" 
    role="tab" 
    class="tab" 
    aria-label="Generate Key"
    checked={true}
  />
  <div role="tabpanel" class="tab-content">
    <GenerateKey on:addKeys={e => dispatch('addKeys', e.detail)} />
  </div>

  <input 
    type="radio" 
    name="add_keys_tabs" 
    role="tab" 
    class="tab" 
    aria-label="Load Key File"
  />
  <div role="tabpanel" class="tab-content">
    <LoadKeyFile on:addKeys={e => dispatch('addKeys', e.detail)} />
  </div>

  <input 
    type="radio" 
    name="add_keys_tabs" 
    role="tab" 
    class="tab" 
    aria-label="Paste Keys"
  />
  <div role="tabpanel" class="tab-content">
    <PasteKeys on:addKeys={e => dispatch('addKeys', e.detail)} />
  </div>
</div>
</div>
