<script lang="ts">
  import { Notification } from 'svelma';
  import { onMount } from 'svelte';

  let active = false;
  let type = '';
  let message = '';
  let notificationElement: Notification;

  onMount(() => {
    // Check if the notification element exists. If not, set active to false.
    if (!notificationElement) {
      active = false;
    }
  });

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

<Notification bind:this={notificationElement} {type} {active} on:close={() => (active = false)}>
  <!-- Need to override the `close` handling so the element isn’t deleted. -->
  {message}
</Notification>
