<script lang="ts">
	import '$lib/styles/app.css';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	let { children } = $props();

	let stickyEl: HTMLDivElement;

	onMount(() => {
		const updateHeight = () => {
			if (!stickyEl) return;
			document.documentElement.style.setProperty('--header-total-h', `${stickyEl.offsetHeight}px`);
		};

		updateHeight();

		const ro = new ResizeObserver(updateHeight);
		ro.observe(stickyEl);

		return () => {
			ro.disconnect();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/logo.png" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<div bind:this={stickyEl} class="sticky top-0 z-50">
		<Header />
	</div>
	
	<main class="font-nunito flex-1">
		{@render children()}
	</main>

	<Footer />
</div>
