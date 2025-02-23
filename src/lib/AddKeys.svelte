<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { KeyPair } from './pgp';
  import GenerateKey from './GenerateKey.svelte';
  import LoadKeyFile from './LoadKeyFile.svelte';
  import PasteKeys from './PasteKeys.svelte';
  import { Tabs, Tab } from 'svelma'

  const dispatch = createEventDispatcher<{
    addKeys: KeyPair;
  }>();
</script>

<div class="card block">
  <div class="card-content">
    <Tabs>
      <Tab label="Generate Key">
        <GenerateKey on:addKeys={e => dispatch('addKeys', e.detail)} />
      </Tab>
      <Tab label="Load Key File">
        <LoadKeyFile on:addKeys={e => dispatch('addKeys', e.detail)} />
      </Tab>
      <Tab label="Paste Keys">
        <PasteKeys on:addKeys={e => dispatch('addKeys', e.detail)} />
      </Tab>
    </Tabs>
  </div>
</div>
