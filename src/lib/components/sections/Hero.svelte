<script lang="ts">
	import { userStore } from '$lib/stores/auth';
	import Wave from '$lib/components/ui/Wave.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { openLoginModal, openRegisterModal } from '$lib/stores/modalStore';

	let { title, description }: { title?: string; description?: string } = $props();
</script>

<section class="relative bg-gradient-to-b from-tide/5 via-white to-white">
	<div class="mx-auto max-w-3xl px-4 pt-16 pb-8 sm:pt-24 sm:pb-12">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<span class="inline-flex items-center gap-1.5 rounded-full bg-tide/10 px-3 py-1 text-xs font-medium tracking-wide text-tide uppercase">
				<span class="h-1.5 w-1.5 rounded-full bg-tide"></span>
				Sundhed &amp; velvære
			</span>

			{#if $userStore}
				<span class="text-sm text-slate-500">
					Velkommen tilbage, <strong class="font-medium text-slate-700">{$userStore.email}</strong>
				</span>
			{:else}
				<button
					onclick={openLoginModal}
					class="text-sm font-medium text-slate-500 transition hover:text-tide"
				>
					Log ind →
				</button>
			{/if}
		</div>

		{#if title}
			<div class="font-display mt-6 text-4xl leading-tight font-semibold text-slate-900 sm:text-5xl">
				{@html title}
			</div>
		{:else}
			<h1 class="font-display mt-6 text-4xl leading-tight font-semibold text-slate-900 sm:text-5xl">
				Rum til at få det<br class="hidden sm:block" /> bedre.
			</h1>
		{/if}

		<p class="mt-5 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
			{description ?? 'Book en tid hos os, og lad os hjælpe dig videre — roligt, fagligt og uden ventetid.'}
		</p>

		<div class="mt-8 flex flex-wrap items-center gap-4">
			<Button href="/book" size="lg">
				Se ledige tider
				<svg viewBox="0 0 16 16" class="h-3.5 w-3.5" fill="none" aria-hidden="true">
					<path d="M2 8h11M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</Button>

			{#if !$userStore}
				<button
					onclick={openRegisterModal}
					class="text-sm font-medium text-slate-500 transition hover:text-slate-800"
				>
					Opret en konto
				</button>
			{/if}
		</div>
	</div>

	<Wave tone="light" class="h-16 sm:h-24" />
</section>