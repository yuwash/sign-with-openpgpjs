<script lang="ts">
  let active = false;
  let type = '';
  let message = '';

  function post(statusMessage: string) {
    type = 'is-success';
    message = statusMessage;
    active = true;
  }

  function postError(errorMessage: string) {
    type = 'is-danger';
    message = errorMessage;
    active = true;
  }

  export { post, postError, active };
</script>

{#if active}
  <div class="notification {type} block">
    <button class="delete" on:click={() => (active = false)} aria-label="close"></button>
    {message}
  </div>
{/if}
