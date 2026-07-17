<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { userStore } from '$lib/stores/auth';

	let { data } = $props();

	const p = $derived(data.page.properties);
</script>

<SeoHead seo={p} />

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

	<p>{p.title}</p>
</div>
