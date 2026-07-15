<script lang="ts">
	import { userStore } from '$lib/stores/auth';
</script>

<div>
	Velkommen til
	{#if $userStore}
		{$userStore.email}! <br />
		{$userStore.uid}! <br />
		{#each $userStore.roles as role}
			{role} <br />
		{/each}
	{:else}
		Du er ikke logget ind.
	{/if}
</div>
