<script lang="ts">
	import { userStore } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import { openLoginModal, openRegisterModal } from '$lib/stores/modalStore';

	let { title, description }: { title?: string; description?: string } = $props();

	const stats = [
		{ n: '100+', label: 'Tilfredse kunder' },
		{ n: '< 1 min', label: 'At booke' },
		{ n: '24/7', label: 'Online booking' }
	];
</script>

<section class="relative overflow-hidden bg-[#ECF0E9]">
	<div
		class="pointer-events-none absolute inset-0"
		aria-hidden="true"
		style="background: radial-gradient(ellipse 80% 55% at 50% -10%, rgba(198,137,88,0.18), transparent)"
	></div>

	<svg
		viewBox="0 0 1000 420"
		preserveAspectRatio="none"
		class="pointer-events-none absolute inset-0 h-full w-full text-[#172420]/[0.055]"
		aria-hidden="true"
	>
		<path
			class="hero-line"
			d="M-50,340 C120,180 200,420 340,260 C460,120 520,340 640,200 C760,60 840,260 1050,90"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
		/>
	</svg>

	<div class="relative mx-auto max-w-3xl px-4 pt-20 pb-16 text-center sm:pt-32 sm:pb-24">
		<div class="flex flex-wrap items-center justify-center gap-3">
			<span
				class="inline-flex items-center gap-2.5 rounded-full border border-[#172420]/10 bg-white/80 px-4 py-1.5 font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.18em] text-[#96392C] uppercase backdrop-blur-sm"
			>
				<span class="relative flex h-2 w-2">
					<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#96392C] opacity-60"></span>
					<span class="relative inline-flex h-2 w-2 rounded-full bg-[#96392C]"></span>
				</span>
				Åben for booking
			</span>

			{#if $userStore}
				<span class="rounded-full border border-[#172420]/8 bg-white/60 px-3 py-1 text-[13px] text-[#46605A] backdrop-blur-sm">
					Velkommen tilbage, <strong class="font-semibold text-[#172420]">{$userStore.email}</strong>
				</span>
			{:else}
				<button
					onclick={openLoginModal}
					class="text-[13px] text-[#46605A] underline decoration-[#46605A]/30 underline-offset-4 transition hover:text-[#172420]"
				>
					Log ind
				</button>
			{/if}
		</div>

		{#if title}
			<div class="mt-8 font-['Instrument_Serif'] text-[3rem] leading-[1.04] text-[#172420] italic sm:text-[4.5rem]">
				{@html title}
			</div>
		{:else}
			<h1 class="mt-8 font-['Instrument_Serif'] text-[3rem] leading-[1.04] text-[#172420] italic sm:text-[4.5rem]">
				Find en tid,<br />der passer dig.
			</h1>
		{/if}

		<p class="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#46605A] sm:text-lg">
			{description ?? 'Se ledige tider i realtid, og book direkte online — hurtigt, enkelt og uden ventetid.'}
		</p>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-5">
			<Button href="/book" size="lg">
				Se ledige tider
				<svg viewBox="0 0 16 16" class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" aria-hidden="true">
					<path d="M2 8h11M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</Button>

			{#if !$userStore}
				<button
					onclick={openRegisterModal}
					class="text-sm font-medium text-[#46605A] underline decoration-[#46605A]/30 underline-offset-4 transition hover:text-[#172420] hover:decoration-[#172420]/40"
				>
					Opret en gratis konto
				</button>
			{/if}
		</div>

		<div class="mx-auto mt-14 grid max-w-xs grid-cols-3 divide-x divide-[#172420]/8 overflow-hidden rounded-2xl border border-[#172420]/8 bg-white/70 backdrop-blur-sm sm:max-w-sm">
			{#each stats as stat}
				<div class="px-4 py-4 text-center">
					<p class="font-['Instrument_Serif'] text-xl text-[#172420] italic">{stat.n}</p>
					<p class="mt-0.5 text-[10px] text-[#46605A]/65">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.hero-line {
		stroke-dasharray: 1400;
		stroke-dashoffset: 1400;
		animation: draw 2.4s ease-out forwards;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-line {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>