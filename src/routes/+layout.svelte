<script lang="ts">
	import '$lib/styles/app.css';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { userStore } from '$lib/stores/auth';

	let { children, data } = $props();

	let stickyEl: HTMLDivElement;

	$effect(() => {
		userStore.set(data.loggedInUser);
	});

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
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#ECF0E9] font-['Public_Sans']">
	<div bind:this={stickyEl} class="sticky top-0 z-50">
		<Header />
	</div>

	<main class="flex-1">
		{@render children()}
	</main>

	<Footer />
	<Toast />
</div>