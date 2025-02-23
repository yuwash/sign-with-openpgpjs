<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let label: string;
  export let open: boolean = false;

  const dispatch = createEventDispatcher();

  function toggleOpen() {
    open = !open;
    dispatch('toggle');
  }
</script>

<div class="card mb-2">
  <header class="card-header">
    <p class="card-header-title is-clickable" on:click={toggleOpen}>
      {label}
    </p>
  </header>
  <div class="card-content" class:is-hidden={!open}>
    <slot />
  </div>
</div>

<style>
  .is-clickable {
    cursor: pointer;
  }

  .is-hidden {
    display: none;
  }
</style>
